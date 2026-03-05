import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/prisma";
import { getBearerToken, verifyAdminToken } from "@/server/auth";
import { sanitizePlainText } from "@/server/cms-utils";
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

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!requireAdmin(request)) return unauthorized();

  try {
    const { id } = await context.params;
    const existing = await prisma.contactMessage.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json({ message: "Contact message not found" }, { status: 404 });
    }

    const body = (await request.json()) as { status?: string; responseNotes?: string };
    const requestedStatus = String(body.status || "").trim();

    if (requestedStatus !== "new" && requestedStatus !== "responded") {
      return NextResponse.json({ message: "Status must be either 'new' or 'responded'" }, { status: 400 });
    }

    const updated = await prisma.contactMessage.update({
      where: { id },
      data: {
        status: requestedStatus,
        responseNotes: sanitizePlainText(body.responseNotes || ""),
        respondedAt: requestedStatus === "responded" ? new Date() : null,
      },
    });

    return NextResponse.json({ message: serializeContact(updated) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update contact message";
    return NextResponse.json({ message }, { status: 500 });
  }
}
