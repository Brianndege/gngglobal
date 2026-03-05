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
  if (file.size > 1024 * 1024) return null;
  return file.arrayBuffer().then((buffer) => {
    const base64 = Buffer.from(buffer).toString("base64");
    return `data:${file.type || "application/octet-stream"};base64,${base64}`;
  });
}

export async function GET(request: NextRequest) {
  if (!requireAdmin(request)) return unauthorized();

  try {
    const posts = await prisma.post.findMany({ orderBy: { updatedAt: "desc" } });
    return NextResponse.json({ posts: posts.map(serializePost) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load posts";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!requireAdmin(request)) return unauthorized();

  try {
    const formData = await request.formData();
    const title = String(formData.get("title") || "").trim();
    const content = String(formData.get("content") || "").trim();
    const status = String(formData.get("status") || "draft") === "published" ? "published" : "draft";
    const rawSlug = slugify(String(formData.get("slug") || title));
    const featuredImageAlt = String(formData.get("featuredImageAlt") || "").trim();
    const imageFile = formData.get("featuredImage");
    const imageDataUrl = imageFile instanceof File ? await toDataUrl(imageFile) : null;

    const errors: string[] = [];
    if (!title) errors.push("Title is required");
    if (!content) errors.push("Content is required");
    if (!rawSlug) errors.push("Slug is required");
    if (imageDataUrl && !featuredImageAlt) errors.push("Featured image alt text is required when an image is provided");

    if (errors.length) {
      return NextResponse.json({ message: "Validation failed", errors }, { status: 400 });
    }

    const slug = await ensureUniqueSlug(rawSlug);
    const social = socialFromFormData(formData);
    const publishDate = parseDate(formData.get("publishDate"));

    const post = await prisma.post.create({
      data: {
        title,
        subheading: String(formData.get("subheading") || "").trim(),
        slug,
        category: String(formData.get("category") || "General").trim() || "General",
        featuredImageUrl: imageDataUrl,
        featuredImageAlt: imageDataUrl ? featuredImageAlt : null,
        content: sanitizeContent(content),
        metaTitle: String(formData.get("metaTitle") || "").trim(),
        metaDescription: String(formData.get("metaDescription") || "").trim(),
        socialFacebook: social.facebook,
        socialInstagram: social.instagram,
        socialLinkedin: social.linkedin,
        socialTwitter: social.twitter,
        status,
        publishDate,
        publishedAt: status === "published" ? publishDate || new Date() : null,
      },
    });

    return NextResponse.json({ post: serializePost(post) }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create post";
    return NextResponse.json({ message }, { status: 500 });
  }
}
