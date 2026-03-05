import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/prisma";
import { serializePost } from "@/server/serializers";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const page = Math.max(Number(request.nextUrl.searchParams.get("page") || 1), 1);
    const limit = Math.min(Math.max(Number(request.nextUrl.searchParams.get("limit") || 6), 1), 50);
    const categoryRaw = request.nextUrl.searchParams.get("category");
    const category = categoryRaw && categoryRaw !== "All" ? categoryRaw : null;

    const where = {
      status: "published" as const,
      archivedAt: null,
      OR: [
        { scheduledFor: null },
        { scheduledFor: { lte: new Date() } },
      ],
      ...(category ? { category } : {}),
    };

    const [posts, total, categories] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.post.count({ where }),
      prisma.post.findMany({
        where: {
          status: "published",
          archivedAt: null,
          OR: [{ scheduledFor: null }, { scheduledFor: { lte: new Date() } }],
        },
        distinct: ["category"],
        select: { category: true },
        orderBy: { category: "asc" },
      }),
    ]);

    return NextResponse.json(
      {
        posts: posts.map(serializePost),
        categories: categories.map((item: { category: string }) => item.category).filter(Boolean),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasMore: page * limit < total,
        },
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400",
        },
      }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch posts";
    return NextResponse.json({ message }, { status: 500 });
  }
}
