import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/prisma";
import { getBearerToken, verifyAdminToken } from "@/server/auth";

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

export async function GET(request: NextRequest) {
  if (!requireAdmin(request)) return unauthorized();

  try {
    const posts = await prisma.post.findMany({
      where: { archivedAt: null },
      orderBy: [{ viewCount: "desc" }, { updatedAt: "desc" }],
      take: 50,
      select: {
        id: true,
        title: true,
        slug: true,
        viewCount: true,
        likeCount: true,
        commentCount: true,
        referralSources: true,
      },
    });

    const totals = posts.reduce(
      (acc, item) => {
        acc.views += item.viewCount;
        acc.likes += item.likeCount;
        acc.comments += item.commentCount;
        return acc;
      },
      { views: 0, likes: 0, comments: 0 }
    );

    const referralTotals = posts.reduce<Record<string, number>>((acc, item) => {
      const sources = (item.referralSources || {}) as Record<string, number>;
      Object.entries(sources).forEach(([key, value]) => {
        acc[key] = (acc[key] || 0) + Number(value || 0);
      });
      return acc;
    }, {});

    return NextResponse.json({
      totals,
      popularPosts: posts.slice(0, 8),
      engagementRate: totals.views > 0 ? Number((((totals.likes + totals.comments) / totals.views) * 100).toFixed(2)) : 0,
      referralSources: referralTotals,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load analytics";
    return NextResponse.json({ message }, { status: 500 });
  }
}
