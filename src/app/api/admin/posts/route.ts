import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/server/prisma";
import { getBearerToken, verifyAdminToken } from "@/server/auth";
import { markdownToHtml, parseBool, parseCsvList, parseDate, sanitizeContent, slugify } from "@/server/cms-utils";
import { serializePost } from "@/server/serializers";

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

interface SocialFallback {
  facebook?: boolean;
  instagram?: boolean;
  linkedin?: boolean;
  twitter?: boolean;
}

function socialFromFormData(formData: FormData, fallback?: SocialFallback) {
  return {
    facebook: formData.get("facebook") !== null ? parseBool(formData.get("facebook")) : Boolean(fallback?.facebook),
    instagram: formData.get("instagram") !== null ? parseBool(formData.get("instagram")) : Boolean(fallback?.instagram),
    linkedin: formData.get("linkedin") !== null ? parseBool(formData.get("linkedin")) : Boolean(fallback?.linkedin),
    twitter: formData.get("twitter") !== null ? parseBool(formData.get("twitter")) : Boolean(fallback?.twitter),
  };
}

async function ensureUniqueSlug(slug: string, ignoreId?: string) {
  const existing = await prisma.post.findFirst({
    where: {
      slug,
      ...(ignoreId ? { id: { not: ignoreId } } : {}),
    },
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

function resolveContent(formData: FormData): { contentFormat: "html" | "markdown"; markdownContent: string; content: string } {
  const contentFormat: "html" | "markdown" = String(formData.get("contentFormat") || "html") === "markdown" ? "markdown" : "html";
  const markdownContent = String(formData.get("markdownContent") || "").trim();
  const htmlInput = String(formData.get("content") || "").trim();

  if (contentFormat === "markdown") {
    const compiled = sanitizeContent(markdownToHtml(markdownContent));
    return {
      contentFormat,
      markdownContent,
      content: compiled,
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

function parseRelatedPostIds(formData: FormData) {
  const csv = String(formData.get("relatedPostIds") || "").trim();
  return parseCsvList(csv).slice(0, 12);
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

export async function GET(request: NextRequest) {
  const admin = requireAdmin(request);
  if (!admin) return unauthorized();

  try {
    const search = String(request.nextUrl.searchParams.get("search") || "").trim();
    const status = String(request.nextUrl.searchParams.get("status") || "").trim();
    const workflow = String(request.nextUrl.searchParams.get("workflow") || "").trim();
    const category = String(request.nextUrl.searchParams.get("category") || "").trim();
    const authorId = String(request.nextUrl.searchParams.get("authorId") || "").trim();
    const featured = String(request.nextUrl.searchParams.get("featured") || "").trim();
    const archived = String(request.nextUrl.searchParams.get("archived") || "active").trim();

    const workflowValue = ["draft", "review", "approved", "rejected", "published", "archived"].includes(workflow)
      ? (workflow as "draft" | "review" | "approved" | "rejected" | "published" | "archived")
      : "";

    const where: Prisma.PostWhereInput = {
      ...(archived === "all"
        ? {}
        : archived === "archived"
          ? { archivedAt: { not: null } }
          : { archivedAt: null }),
      ...(status ? { status: status === "published" ? "published" : "draft" } : {}),
      ...(workflowValue ? { workflowStatus: workflowValue } : {}),
      ...(category ? { category } : {}),
      ...(authorId ? { OR: [{ authorId }, { assignedAuthorId: authorId }] } : {}),
      ...(featured ? { isFeatured: featured === "true" } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" } },
              { subheading: { contains: search, mode: "insensitive" } },
              { excerpt: { contains: search, mode: "insensitive" } },
              { slug: { contains: search, mode: "insensitive" } },
              { tags: { has: search.toLowerCase() } },
            ],
          }
        : {}),
    };

    const [posts, categories, authors] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          _count: { select: { revisions: true } },
          author: { select: { id: true, name: true, email: true } },
          assignedAuthor: { select: { id: true, name: true, email: true } },
        },
        orderBy: [{ updatedAt: "desc" }],
      }),
      prisma.post.findMany({ where: { archivedAt: null }, distinct: ["category"], select: { category: true }, orderBy: { category: "asc" } }),
      prisma.adminUser.findMany({ select: { id: true, name: true, email: true, role: true }, orderBy: { name: "asc" } }),
    ]);

    const summary = {
      total: posts.length,
      drafts: posts.filter((item: (typeof posts)[number]) => item.status === "draft").length,
      published: posts.filter((item: (typeof posts)[number]) => item.status === "published").length,
      pendingApproval: posts.filter((item: (typeof posts)[number]) => item.workflowStatus === "review").length,
      scheduled: posts.filter((item: (typeof posts)[number]) => item.scheduledFor !== null && item.status === "draft").length,
      archived: posts.filter((item: (typeof posts)[number]) => item.archivedAt !== null).length,
      featured: posts.filter((item: (typeof posts)[number]) => item.isFeatured).length,
    };

    return NextResponse.json({
      posts: posts.map((item: (typeof posts)[number]) => ({ ...serializePost(item), revisionCount: item._count.revisions, author: item.author, assignedAuthor: item.assignedAuthor })),
      categories: categories.map((item: (typeof categories)[number]) => item.category).filter(Boolean),
      authors,
      summary,
      permissions: {
        canPublish: admin.role === "admin",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load posts";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const admin = requireAdmin(request);
  if (!admin) return unauthorized();

  try {
    const formData = await request.formData();
    const title = String(formData.get("title") || "").trim();
    const rawSlug = slugify(String(formData.get("slug") || title));
    const featuredImageAlt = String(formData.get("featuredImageAlt") || "").trim();
    const imageFile = formData.get("featuredImage");
    const imageDataUrl = imageFile instanceof File ? await toDataUrl(imageFile) : null;
    const directImageUrl = String(formData.get("featuredImageUrl") || "").trim();

    const { content, contentFormat, markdownContent } = resolveContent(formData);
    const statusInput = String(formData.get("status") || "draft") === "published" ? "published" : "draft";
    const workflowInput = String(formData.get("workflowStatus") || "draft");
    const { status, workflowStatus } = resolveWorkflow(statusInput, workflowInput, admin.role);

    const errors: string[] = [];
    if (!title) errors.push("Title is required");
    if (!content) errors.push("Content is required");
    if (!rawSlug) errors.push("Slug is required");
    if ((imageDataUrl || directImageUrl) && !featuredImageAlt) errors.push("Featured image alt text is required when an image is provided");

    if (errors.length) {
      return NextResponse.json({ message: "Validation failed", errors }, { status: 400 });
    }

    const slug = await ensureUniqueSlug(rawSlug);
    const social = socialFromFormData(formData);
    const publishDate = parseDate(formData.get("publishDate"));
    const scheduledFor = parseDate(formData.get("scheduledFor"));
    const featuredImageUrl = imageDataUrl || directImageUrl || null;

    const post = await prisma.post.create({
      data: {
        title,
        excerpt: String(formData.get("excerpt") || "").trim(),
        subheading: String(formData.get("subheading") || "").trim(),
        slug,
        category: String(formData.get("category") || "General").trim() || "General",
        tags: parseCsvList(formData.get("tags")).slice(0, 20),
        featuredImageUrl,
        featuredImageAlt: featuredImageUrl ? featuredImageAlt : null,
        mediaLibrary: featuredImageUrl
          ? [
              {
                url: featuredImageUrl,
                alt: featuredImageAlt,
                uploadedAt: new Date().toISOString(),
              },
            ]
          : undefined,
        content,
        contentFormat,
        markdownContent,
        metaTitle: String(formData.get("metaTitle") || "").trim(),
        metaDescription: String(formData.get("metaDescription") || "").trim(),
        canonicalUrl: String(formData.get("canonicalUrl") || "").trim(),
        ogTitle: String(formData.get("ogTitle") || "").trim(),
        ogDescription: String(formData.get("ogDescription") || "").trim(),
        ogImage: String(formData.get("ogImage") || "").trim(),
        twitterTitle: String(formData.get("twitterTitle") || "").trim(),
        twitterDescription: String(formData.get("twitterDescription") || "").trim(),
        twitterImage: String(formData.get("twitterImage") || "").trim(),
        twitterCard: String(formData.get("twitterCard") || "summary_large_image").trim(),
        socialFacebook: social.facebook,
        socialInstagram: social.instagram,
        socialLinkedin: social.linkedin,
        socialTwitter: social.twitter,
        relatedPostIds: parseRelatedPostIds(formData),
        isFeatured: parseBool(formData.get("isFeatured")),
        status,
        workflowStatus,
        approvalNotes: String(formData.get("approvalNotes") || "").trim(),
        scheduledFor,
        publishDate,
        publishedAt: status === "published" ? publishDate || scheduledFor || new Date() : null,
        assignedAuthorId: String(formData.get("assignedAuthorId") || "").trim() || null,
        authorId: admin.sub,
        referralSources: { direct: 0, search: 0, social: 0, partner: 0 },
      },
    });

    await createRevision(post.id, admin.sub, "Initial version created");
    return NextResponse.json({ post: serializePost(post) }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create post";
    return NextResponse.json({ message }, { status: 500 });
  }
}
