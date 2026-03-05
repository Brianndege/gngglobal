import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { prisma } from "@/server/prisma";
import { sanitizePlainText } from "@/server/cms-utils";

export const runtime = "nodejs";

function isValidEmail(email: string) {
  return /^\S+@\S+\.\S+$/.test(email);
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

async function notify(message: { name: string; email: string; phone: string; company: string; message: string; createdAt: Date }) {
  const transporter = createTransporter();
  const to = process.env.CONTACT_NOTIFY_TO;
  const from = process.env.CONTACT_NOTIFY_FROM || process.env.SMTP_FROM || process.env.SMTP_USER;
  if (!transporter || !to || !from) return;

  const createdAt = new Date(message.createdAt).toLocaleString("en-AU");
  const text = [
    "A new contact message was submitted.",
    "",
    `Name: ${message.name}`,
    `Email: ${message.email}`,
    `Phone: ${message.phone || "-"}`,
    `Company: ${message.company || "-"}`,
    `Received: ${createdAt}`,
    "",
    "Message:",
    message.message,
  ].join("\n");

  try {
    await transporter.sendMail({
      from,
      to,
      subject: `New contact message from ${message.name}`,
      text,
      replyTo: message.email,
    });
  } catch {
    // Best effort notification
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      phone?: string;
      company?: string;
      message?: string;
      website?: string;
    };

    if (body.website) {
      return NextResponse.json({ message: "Message sent successfully" });
    }

    const name = sanitizePlainText(body.name);
    const email = sanitizePlainText(body.email).toLowerCase();
    const phone = sanitizePlainText(body.phone);
    const company = sanitizePlainText(body.company);
    const message = sanitizePlainText(body.message);

    if (!name) return NextResponse.json({ message: "Name is required" }, { status: 400 });
    if (!email || !isValidEmail(email)) return NextResponse.json({ message: "A valid email address is required" }, { status: 400 });
    if (!message || message.length < 20) return NextResponse.json({ message: "Message must be at least 20 characters" }, { status: 400 });

    const created = await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone,
        company,
        message,
        source: "contact-page",
        status: "new",
      },
    });

    await notify({
      name: created.name,
      email: created.email,
      phone: created.phone,
      company: created.company,
      message: created.message,
      createdAt: created.createdAt,
    });

    return NextResponse.json({ message: "Message sent successfully" }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to send message";
    return NextResponse.json({ message }, { status: 500 });
  }
}
