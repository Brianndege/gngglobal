import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/prisma";
import { getBearerToken, verifyAdminToken } from "@/server/auth";
import { markdownToHtml, parseBool, parseCsvList, parseDate, sanitizeContent, slugify } from "@/server/cms-utils";
import { serializePost, serializePostRevision } from "@/server/serializers";

export const runtime = "nodejs";

function unauthorized() {
  return NextResponse.json({ message: "Missing or invalid authorization token" }, { status: 401 });
}

function requireAdmin(request: NextRequest) {
  const token = getBearerToken(request);
  if (!token) return null;

  try {
    return verifyAdminToken(token);
  } catch {
    return null;
  }
}

async function ensureUniqueSlug(slug: string, ignoreId?: string) {
  const existing = await prisma.post.findFirst({
    where: { slug, ...(ignoreId ? { id: { not: ignoreId } } : {}) },
    select: { id: true },
  });

  if (!existing) return slug;
  return `${slug}-${Date.now()}`;
}

function toDataUrl(file: File | null) {
  if (!file || file.size === 0) return null;
  if (file.size > 1024 * 1024 * 2) return null;
  return file.arrayBuffer().then((buffer) => {
    const base64 = Buffer.from(buffer).toString("base64");
    return `data:${file.type || "application/octet-stream"};base64,${base64}`;
  });
}

function resolveContent(
  formData: FormData,
  existingContent: string,
  existingFormat: "html" | "markdown",
  existingMarkdown: string | null
): { contentFormat: "html" | "markdown"; markdownContent: string; content: string } {
  const contentFormat: "html" | "markdown" = String(formData.get("contentFormat") || existingFormat) === "markdown" ? "markdown" : "html";
  const markdownContent = String(formData.get("markdownContent") || existingMarkdown || "").trim();
  const htmlInput = String(formData.get("content") || existingContent).trim();

  if (contentFormat === "markdown") {
    return {
      contentFormat,
      markdownContent,
      content: sanitizeContent(markdownToHtml(markdownContent)),
    };
  }

  return {
    contentFormat,
    markdownContent: "",
    content: sanitizeContent(htmlInput),
  };
}

function resolveWorkflow(status: "draft" | "published", workflowStatusRaw: string, role: "admin" | "editor") {
  let workflowStatus = ["draft", "review", "approved", "rejected", "published", "archived"].includes(workflowStatusRaw)
    ? (workflowStatusRaw as "draft" | "review" | "approved" | "rejected" | "published" | "archived")
    : "draft";

  let effectiveStatus = status;

  if (role !== "admin" && status === "published") {
    effectiveStatus = "draft";
    workflowStatus = "review";
  }

  if (effectiveStatus === "published" && workflowStatus !== "published") {
    workflowStatus = "approved";
  }

  return { status: effectiveStatus, workflowStatus };
}

async function createRevision(postId: string, createdById: string, note: string) {
  const current = await prisma.post.findUnique({ where: { id: postId } });
  if (!current) return;

  await prisma.postRevision.create({
    data: {
      postId: current.id,
      title: current.title,
      excerpt: current.excerpt,
      subheading: current.subheading,
      slug: current.slug,
      category: current.category,
      tags: current.tags,
      content: current.content,
      contentFormat: current.contentFormat,
      markdownContent: current.markdownContent,
      metaTitle: current.metaTitle,
      metaDescription: current.metaDescription,
      canonicalUrl: current.canonicalUrl,
      ogTitle: current.ogTitle,
      ogDescription: current.ogDescription,
      ogImage: current.ogImage,
      twitterTitle: current.twitterTitle,
      twitterDescription: current.twitterDescription,
      twitterImage: current.twitterImage,
      twitterCard: current.twitterCard,
      socialFacebook: current.socialFacebook,
      socialInstagram: current.socialInstagram,
      socialLinkedin: current.socialLinkedin,
      socialTwitter: current.socialTwitter,
      relatedPostIds: current.relatedPostIds,
      isFeatured: current.isFeatured,
      status: current.status,
      workflowStatus: current.workflowStatus,
      publishDate: current.publishDate,
      scheduledFor: current.scheduledFor,
      revisionNote: note,
      createdById,
    },
  });
}

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const admin = requireAdmin(request);
  if (!admin) return unauthorized();

  try {
    const { id } = await context.params;
    const post = await prisma.post.findUnique({ where: { id } });

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    const revisions = await prisma.postRevision.findMany({
      where: { postId: id },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return NextResponse.json({
      post: serializePost(post),
      revisions: revisions.map(serializePostRevision),
      permissions: {
        canPublish: admin.role === "admin",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load post";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const admin = requireAdmin(request);
  if (!admin) return unauthorized();

  try {
    const { id } = await context.params;
    const existing = await prisma.post.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    const action = String(request.nextUrl.searchParams.get("action") || "").trim();
    const formData = await request.formData();

    if (action === "autosave") {
      const { content, contentFormat, markdownContent } = resolveContent(formData, existing.content, existing.contentFormat, existing.markdownContent);
      const updated = await prisma.post.update({
        where: { id },
        data: {
          title: String(formData.get("title") || existing.title).trim(),
          subheading: String(formData.get("subheading") || existing.subheading || "").trim(),
          excerpt: String(formData.get("excerpt") || existing.excerpt || "").trim(),
          content,
          contentFormat,
          markdownContent,
          lastAutoSavedAt: new Date(),
        },
      });

      return NextResponse.json({ post: serializePost(updated), message: "Autosaved" });
    }

    if (action === "restore") {
      const revisionId = String(formData.get("revisionId") || "").trim();
      if (!revisionId) {
        return NextResponse.json({ message: "revisionId is required" }, { status: 400 });
      }

      const revision = await prisma.postRevision.findFirst({ where: { id: revisionId, postId: id } });
      if (!revision) {
        return NextResponse.json({ message: "Revision not found" }, { status: 404 });
      }

      await createRevision(id, admin.sub, `Before restore from ${revision.id}`);

      const restored = await prisma.post.update({
        where: { id },
        data: {
          title: revision.title,
          excerpt: revision.excerpt,
          subheading: revision.subheading,
          slug: await ensureUniqueSlug(revision.slug, id),
          category: revision.category,
          tags: revision.tags,
          content: revision.content,
          contentFormat: revision.contentFormat,
          markdownContent: revision.markdownContent,
          metaTitle: revision.metaTitle,
          metaDescription: revision.metaDescription,
          canonicalUrl: revision.canonicalUrl,
          ogTitle: revision.ogTitle,
          ogDescription: revision.ogDescription,
          ogImage: revision.ogImage,
          twitterTitle: revision.twitterTitle,
          twitterDescription: revision.twitterDescription,
          twitterImage: revision.twitterImage,
          twitterCard: revision.twitterCard,
          socialFacebook: revision.socialFacebook,
          socialInstagram: revision.socialInstagram,
          socialLinkedin: revision.socialLinkedin,
          socialTwitter: revision.socialTwitter,
          relatedPostIds: revision.relatedPostIds,
          isFeatured: revision.isFeatured,
          status: revision.status,
          workflowStatus: revision.workflowStatus,
          publishDate: revision.publishDate,
          scheduledFor: revision.scheduledFor,
        },
      });

      return NextResponse.json({ post: serializePost(restored), message: "Revision restored" });
    }

    await createRevision(id, admin.sub, String(formData.get("revisionNote") || "Before update").trim());

    const title = String(formData.get("title") || existing.title).trim();
    const rawSlug = slugify(String(formData.get("slug") || title));
    const errors: string[] = [];

    const imageFile = formData.get("featuredImage");
    const imageDataUrl = imageFile instanceof File ? await toDataUrl(imageFile) : null;
    const removeFeaturedImage = String(formData.get("removeFeaturedImage") || "false") === "true";
    const directImageUrl = String(formData.get("featuredImageUrl") || "").trim();

    let featuredImageUrl = existing.featuredImageUrl;
    let featuredImageAlt = existing.featuredImageAlt;

    if (removeFeaturedImage) {
      featuredImageUrl = null;
      featuredImageAlt = null;
    }

    if (imageDataUrl) {
      featuredImageUrl = imageDataUrl;
      featuredImageAlt = String(formData.get("featuredImageAlt") || "").trim();
    } else if (directImageUrl) {
      featuredImageUrl = directImageUrl;
      featuredImageAlt = String(formData.get("featuredImageAlt") || featuredImageAlt || "").trim();
    } else if (featuredImageUrl) {
      featuredImageAlt = String(formData.get("featuredImageAlt") || featuredImageAlt || "").trim();
    }

    if (featuredImageUrl && !featuredImageAlt) {
      errors.push("Featured image alt text is required when an image is provided");
    }

    const { content, contentFormat, markdownContent } = resolveContent(formData, existing.content, existing.contentFormat, existing.markdownContent);

    const statusInput = String(formData.get("status") || existing.status) === "published" ? "published" : "draft";
    const workflowInput = String(formData.get("workflowStatus") || existing.workflowStatus || "draft");
    const { status, workflowStatus } = resolveWorkflow(statusInput, workflowInput, admin.role);

    if (!title) errors.push("Title is required");
    if (!content) errors.push("Content is required");
    if (!rawSlug) errors.push("Slug is required");

    if (errors.length) {
      return NextResponse.json({ message: "Validation failed", errors }, { status: 400 });
    }

    const slug = await ensureUniqueSlug(rawSlug, id);
    const social = {
      facebook: formData.get("facebook") !== null ? parseBool(formData.get("facebook")) : existing.socialFacebook,
      instagram: formData.get("instagram") !== null ? parseBool(formData.get("instagram")) : existing.socialInstagram,
      linkedin: formData.get("linkedin") !== null ? parseBool(formData.get("linkedin")) : existing.socialLinkedin,
      twitter: formData.get("twitter") !== null ? parseBool(formData.get("twitter")) : existing.socialTwitter,
    };

    const publishDate = parseDate(formData.get("publishDate")) ?? existing.publishDate;
    const scheduledFor = parseDate(formData.get("scheduledFor")) ?? existing.scheduledFor;
    const publishedAt = status === "published" ? existing.publishedAt || publishDate || scheduledFor || new Date() : null;

    const updated = await prisma.post.update({
      where: { id },
      data: {
        title,
        excerpt: String(formData.get("excerpt") || existing.excerpt || "").trim(),
        subheading: String(formData.get("subheading") || existing.subheading || "").trim(),
        slug,
        category: String(formData.get("category") || existing.category || "General").trim() || "General",
        tags: parseCsvList(formData.get("tags") || existing.tags.join(",")).slice(0, 20),
        content,
        contentFormat,
        markdownContent,
        metaTitle: String(formData.get("metaTitle") || existing.metaTitle || "").trim(),
        metaDescription: String(formData.get("metaDescription") || existing.metaDescription || "").trim(),
        canonicalUrl: String(formData.get("canonicalUrl") || existing.canonicalUrl || "").trim(),
        ogTitle: String(formData.get("ogTitle") || existing.ogTitle || "").trim(),
        ogDescription: String(formData.get("ogDescription") || existing.ogDescription || "").trim(),
        ogImage: String(formData.get("ogImage") || existing.ogImage || "").trim(),
        twitterTitle: String(formData.get("twitterTitle") || existing.twitterTitle || "").trim(),
        twitterDescription: String(formData.get("twitterDescription") || existing.twitterDescription || "").trim(),
        twitterImage: String(formData.get("twitterImage") || existing.twitterImage || "").trim(),
        twitterCard: String(formData.get("twitterCard") || existing.twitterCard || "summary_large_image").trim(),
        socialFacebook: social.facebook,
        socialInstagram: social.instagram,
        socialLinkedin: social.linkedin,
        socialTwitter: social.twitter,
        relatedPostIds: parseCsvList(formData.get("relatedPostIds") || existing.relatedPostIds.join(",")).slice(0, 12),
        isFeatured: formData.get("isFeatured") !== null ? parseBool(formData.get("isFeatured")) : existing.isFeatured,
        status,
        workflowStatus,
        approvalNotes: String(formData.get("approvalNotes") || existing.approvalNotes || "").trim(),
        publishDate,
        scheduledFor,
        publishedAt,
        archivedAt: workflowStatus === "archived" ? existing.archivedAt || new Date() : null,
        featuredImageUrl,
        featuredImageAlt,
        assignedAuthorId: String(formData.get("assignedAuthorId") || existing.assignedAuthorId || "").trim() || null,
      },
    });

    return NextResponse.json({ post: serializePost(updated) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update post";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const admin = requireAdmin(request);
  if (!admin) return unauthorized();

  try {
    const { id } = await context.params;
    await prisma.post.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (error: unknown) {
    const knownError = error as { code?: string };

    if (knownError.code === "P2025") {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    const message = error instanceof Error ? error.message : "Failed to delete post";
    return NextResponse.json({ message }, { status: 500 });
  }
}
