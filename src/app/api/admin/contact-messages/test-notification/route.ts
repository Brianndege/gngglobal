import nodemailer from "nodemailer";
import { NextRequest, NextResponse } from "next/server";
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

function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = String(process.env.SMTP_SECURE || "false") === "true";

  if (!host || !port || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
}

export async function POST(request: NextRequest) {
  if (!requireAdmin(request)) return unauthorized();

  const transporter = createTransporter();
  const to = process.env.CONTACT_NOTIFY_TO;
  const from = process.env.CONTACT_NOTIFY_FROM || process.env.SMTP_FROM || process.env.SMTP_USER;

  if (!transporter || !to || !from) {
    return NextResponse.json(
      { message: "SMTP is not configured. Please set SMTP and CONTACT_NOTIFY_* environment values." },
      { status: 400 }
    );
  }

  const sentAt = new Date().toLocaleString("en-AU");

  await transporter.sendMail({
    from,
    to,
    subject: "GNG Contact Notifications: Test Email",
    text: `This is a test contact notification email sent at ${sentAt}.`,
  });

  return NextResponse.json({ message: "Test notification email sent" });
}
