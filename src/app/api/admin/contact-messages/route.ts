import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/prisma";
import { getBearerToken, verifyAdminToken } from "@/server/auth";
import { serializeContact } from "@/server/serializers";

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
    const page = Math.max(Number(request.nextUrl.searchParams.get("page") || 1), 1);
    const limit = Math.min(Math.max(Number(request.nextUrl.searchParams.get("limit") || 25), 1), 200);
    const statusRaw = request.nextUrl.searchParams.get("status");
    const status = statusRaw && statusRaw !== "all" ? statusRaw : null;

    const where = status ? { status: status as "new" | "responded" } : {};

    const [messages, total] = await Promise.all([
      prisma.contactMessage.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.contactMessage.count({ where }),
    ]);

    return NextResponse.json({
      messages: messages.map(serializeContact),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(Math.ceil(total / limit), 1),
        hasMore: page * limit < total,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load contact messages";
    return NextResponse.json({ message }, { status: 500 });
  }
}
