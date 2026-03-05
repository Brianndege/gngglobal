import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/prisma";
import { getBearerToken, verifyAdminToken } from "@/server/auth";
import { parseBool, parseDate, sanitizeContent, slugify } from "@/server/cms-utils";
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

async function ensureUniqueSlug(slug: string, ignoreId?: string) {
  const existing = await prisma.post.findFirst({
    where: { slug, ...(ignoreId ? { id: { not: ignoreId } } : {}) },
    select: { id: true },
  });

  if (!existing) return slug;
  return `${slug}-${Date.now()}`;
}

interface SocialFallback {
  facebook?: boolean;
  instagram?: boolean;
  linkedin?: boolean;
  twitter?: boolean;
}

function socialFromFormData(formData: FormData, fallback: SocialFallback) {
  return {
    facebook: formData.get("facebook") !== null ? parseBool(formData.get("facebook")) : Boolean(fallback?.facebook),
    instagram: formData.get("instagram") !== null ? parseBool(formData.get("instagram")) : Boolean(fallback?.instagram),
    linkedin: formData.get("linkedin") !== null ? parseBool(formData.get("linkedin")) : Boolean(fallback?.linkedin),
    twitter: formData.get("twitter") !== null ? parseBool(formData.get("twitter")) : Boolean(fallback?.twitter),
  };
}

function toDataUrl(file: File | null) {
  if (!file || file.size === 0) return null;
  if (file.size > 1024 * 1024) return null;
  return file.arrayBuffer().then((buffer) => {
    const base64 = Buffer.from(buffer).toString("base64");
    return `data:${file.type || "application/octet-stream"};base64,${base64}`;
  });
}

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!requireAdmin(request)) return unauthorized();

  try {
    const { id } = await context.params;
    const post = await prisma.post.findUnique({ where: { id } });

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ post: serializePost(post) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load post";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!requireAdmin(request)) return unauthorized();

  try {
    const { id } = await context.params;
    const existing = await prisma.post.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    const formData = await request.formData();
    const title = String(formData.get("title") || existing.title).trim();
    const content = String(formData.get("content") || existing.content).trim();
    const status = String(formData.get("status") || existing.status) === "published" ? "published" : "draft";
    const rawSlug = slugify(String(formData.get("slug") || title));

    const errors: string[] = [];
    if (!title) errors.push("Title is required");
    if (!content) errors.push("Content is required");
    if (!rawSlug) errors.push("Slug is required");

    const imageFile = formData.get("featuredImage");
    const imageDataUrl = imageFile instanceof File ? await toDataUrl(imageFile) : null;
    const removeFeaturedImage = String(formData.get("removeFeaturedImage") || "false") === "true";

    let featuredImageUrl = existing.featuredImageUrl;
    let featuredImageAlt = existing.featuredImageAlt;

    if (removeFeaturedImage) {
      featuredImageUrl = null;
      featuredImageAlt = null;
    }

    if (imageDataUrl) {
      featuredImageUrl = imageDataUrl;
      featuredImageAlt = String(formData.get("featuredImageAlt") || "").trim();
    } else if (featuredImageUrl) {
      featuredImageAlt = String(formData.get("featuredImageAlt") || featuredImageAlt || "").trim();
    }

    if (featuredImageUrl && !featuredImageAlt) {
      errors.push("Featured image alt text is required when an image is provided");
    }

    if (errors.length) {
      return NextResponse.json({ message: "Validation failed", errors }, { status: 400 });
    }

    const slug = await ensureUniqueSlug(rawSlug, id);
    const social = socialFromFormData(formData, {
      facebook: existing.socialFacebook,
      instagram: existing.socialInstagram,
      linkedin: existing.socialLinkedin,
      twitter: existing.socialTwitter,
    });

    const publishDate = parseDate(formData.get("publishDate")) ?? existing.publishDate;
    const publishedAt = status === "published" ? existing.publishedAt || publishDate || new Date() : null;

    const updated = await prisma.post.update({
      where: { id },
      data: {
        title,
        subheading: String(formData.get("subheading") || existing.subheading || "").trim(),
        slug,
        category: String(formData.get("category") || existing.category || "General").trim() || "General",
        content: sanitizeContent(content),
        metaTitle: String(formData.get("metaTitle") || existing.metaTitle || "").trim(),
        metaDescription: String(formData.get("metaDescription") || existing.metaDescription || "").trim(),
        socialFacebook: social.facebook,
        socialInstagram: social.instagram,
        socialLinkedin: social.linkedin,
        socialTwitter: social.twitter,
        status,
        publishDate,
        publishedAt,
        featuredImageUrl,
        featuredImageAlt,
      },
    });

    return NextResponse.json({ post: serializePost(updated) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update post";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!requireAdmin(request)) return unauthorized();

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
