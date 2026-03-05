import { NextResponse } from "next/server";
import { prisma } from "@/server/prisma";

export const runtime = "nodejs";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({
      status: "ok",
      db: { readyState: 1, state: "connected" },
    });
  } catch {
    return NextResponse.json({
      status: "error",
      db: { readyState: 0, state: "disconnected" },
    });
  }
}
