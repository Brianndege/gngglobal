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
      where: { featuredImageUrl: { not: null } },
      select: {
        id: true,
        title: true,
        featuredImageUrl: true,
        featuredImageAlt: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: "desc" },
      take: 100,
    });

    return NextResponse.json({
      items: posts.map((item) => ({
        id: item.id,
        postTitle: item.title,
        url: item.featuredImageUrl,
        alt: item.featuredImageAlt || "",
        updatedAt: item.updatedAt,
      })),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load media";
    return NextResponse.json({ message }, { status: 500 });
  }
}
