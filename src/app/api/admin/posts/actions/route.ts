import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/prisma";
import { getBearerToken, verifyAdminToken } from "@/server/auth";
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

export async function POST(request: NextRequest) {
  const admin = requireAdmin(request);
  if (!admin) return unauthorized();

  try {
    const body = (await request.json()) as {
      action?: "archive" | "publish" | "moveToReview" | "duplicate" | "delete";
      ids?: string[];
    };

    const action = body.action;
    const ids = Array.isArray(body.ids) ? body.ids.filter(Boolean) : [];

    if (!action || ids.length === 0) {
      return NextResponse.json({ message: "Action and ids are required" }, { status: 400 });
    }

    if (action === "delete") {
      await prisma.post.deleteMany({ where: { id: { in: ids } } });
      return NextResponse.json({ ok: true, count: ids.length });
    }

    if (action === "duplicate") {
      const source = await prisma.post.findMany({ where: { id: { in: ids } } });
      const created = await Promise.all(
        source.map((item) =>
          prisma.post.create({
            data: {
              title: `${item.title} (Copy)`,
              excerpt: item.excerpt,
              subheading: item.subheading,
              slug: `${item.slug}-copy-${Date.now()}`,
              category: item.category,
              tags: item.tags,
              featuredImageUrl: item.featuredImageUrl,
              featuredImageAlt: item.featuredImageAlt,
              mediaLibrary: item.mediaLibrary || undefined,
              content: item.content,
              contentFormat: item.contentFormat,
              markdownContent: item.markdownContent,
              metaTitle: item.metaTitle,
              metaDescription: item.metaDescription,
              canonicalUrl: item.canonicalUrl,
              ogTitle: item.ogTitle,
              ogDescription: item.ogDescription,
              ogImage: item.ogImage,
              twitterTitle: item.twitterTitle,
              twitterDescription: item.twitterDescription,
              twitterImage: item.twitterImage,
              twitterCard: item.twitterCard,
              socialFacebook: item.socialFacebook,
              socialInstagram: item.socialInstagram,
              socialLinkedin: item.socialLinkedin,
              socialTwitter: item.socialTwitter,
              relatedPostIds: item.relatedPostIds,
              isFeatured: false,
              status: "draft",
              workflowStatus: "draft",
              approvalNotes: null,
              scheduledFor: null,
              publishDate: null,
              publishedAt: null,
              archivedAt: null,
              lastAutoSavedAt: null,
              assignedAuthorId: item.assignedAuthorId,
              authorId: item.authorId,
              viewCount: 0,
              likeCount: 0,
              commentCount: 0,
              referralSources: item.referralSources || { direct: 0, search: 0, social: 0, partner: 0 },
            },
          })
        )
      );

      return NextResponse.json({ posts: created.map(serializePost) });
    }

    if (action === "publish" && admin.role !== "admin") {
      return NextResponse.json({ message: "Only admins can publish posts" }, { status: 403 });
    }

    if (action === "archive") {
      const result = await prisma.post.updateMany({
        where: { id: { in: ids } },
        data: { workflowStatus: "archived", archivedAt: new Date(), status: "draft" },
      });
      return NextResponse.json({ ok: true, count: result.count });
    }

    if (action === "publish") {
      const result = await prisma.post.updateMany({
        where: { id: { in: ids } },
        data: { status: "published", workflowStatus: "approved", publishedAt: new Date(), archivedAt: null },
      });
      return NextResponse.json({ ok: true, count: result.count });
    }

    if (action === "moveToReview") {
      const result = await prisma.post.updateMany({
        where: { id: { in: ids } },
        data: { status: "draft", workflowStatus: "review" },
      });
      return NextResponse.json({ ok: true, count: result.count });
    }

    return NextResponse.json({ message: "Unsupported action" }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to run bulk action";
    return NextResponse.json({ message }, { status: 500 });
  }
}
