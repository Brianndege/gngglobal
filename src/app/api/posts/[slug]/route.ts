import { NextResponse } from "next/server";
import { prisma } from "@/server/prisma";
import { serializePost } from "@/server/serializers";

export const runtime = "nodejs";

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await context.params;

    const post = await prisma.post.findFirst({
      where: { slug, status: "published" },
    });

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ post: serializePost(post) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch post";
    return NextResponse.json({ message }, { status: 500 });
  }
}
