import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/prisma";
import { getBearerToken, verifyAdminToken } from "@/server/auth";

export const runtime = "nodejs";

function escapeCsv(value: unknown) {
  const stringValue = String(value ?? "");
  if (stringValue.includes(",") || stringValue.includes("\n") || stringValue.includes('"')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

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
    const statusRaw = request.nextUrl.searchParams.get("status");
    const status = statusRaw && statusRaw !== "all" ? statusRaw : null;
    const query = String(request.nextUrl.searchParams.get("q") || "").trim();

    const where = {
      ...(status ? { status: status as "active" | "unsubscribed" } : {}),
      ...(query ? { email: { contains: query, mode: "insensitive" as const } } : {}),
    };

    const subscribers = await prisma.newsletterSubscriber.findMany({
      where,
      orderBy: [{ subscribedAt: "desc" }, { createdAt: "desc" }],
    });

    const headers = ["email", "status", "consent", "source", "subscribedAt", "createdAt", "updatedAt"];
    const rows = subscribers.map((subscriber: {
      email: string;
      status: string;
      consent: boolean;
      source: string;
      subscribedAt: Date;
      createdAt: Date;
      updatedAt: Date;
    }) => [
      escapeCsv(subscriber.email),
      escapeCsv(subscriber.status),
      escapeCsv(subscriber.consent),
      escapeCsv(subscriber.source),
      escapeCsv(subscriber.subscribedAt),
      escapeCsv(subscriber.createdAt),
      escapeCsv(subscriber.updatedAt),
    ]);

    const csv = [headers.join(","), ...rows.map((row: string[]) => row.join(","))].join("\n");

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename=\"newsletter-subscribers-${Date.now()}.csv\"`,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to export subscribers";
    return NextResponse.json({ message }, { status: 500 });
  }
}
