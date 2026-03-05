import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/prisma";
import { getBearerToken, verifyAdminToken } from "@/server/auth";
import { serializeSubscriber } from "@/server/serializers";

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
    const limit = Math.min(Math.max(Number(request.nextUrl.searchParams.get("limit") || 50), 1), 200);
    const statusRaw = request.nextUrl.searchParams.get("status");
    const status = statusRaw && statusRaw !== "all" ? statusRaw : null;
    const query = String(request.nextUrl.searchParams.get("q") || "").trim();

    const where = {
      ...(status ? { status: status as "active" | "unsubscribed" } : {}),
      ...(query ? { email: { contains: query, mode: "insensitive" as const } } : {}),
    };

    const [subscribers, total] = await Promise.all([
      prisma.newsletterSubscriber.findMany({
        where,
        orderBy: [{ subscribedAt: "desc" }, { createdAt: "desc" }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.newsletterSubscriber.count({ where }),
    ]);

    return NextResponse.json({
      subscribers: subscribers.map(serializeSubscriber),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load subscribers";
    return NextResponse.json({ message }, { status: 500 });
  }
}
