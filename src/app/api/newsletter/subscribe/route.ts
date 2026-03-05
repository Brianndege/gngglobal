import { NextResponse } from "next/server";
import { prisma } from "@/server/prisma";

export const runtime = "nodejs";

function isValidEmail(email: string) {
  return /^\S+@\S+\.\S+$/.test(email);
}

async function notifyWebhook(payload: Record<string, unknown>) {
  const webhookUrl = process.env.NEWSLETTER_WEBHOOK_URL;
  if (!webhookUrl) return;

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    // Best-effort webhook delivery.
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; consent?: string; source?: string; website?: string };

    if (body.website) {
      return NextResponse.json({ message: "Subscribed successfully" });
    }

    const normalizedEmail = String(body.email || "").toLowerCase().trim();
    const consent = String(body.consent || "false") === "true";

    if (!normalizedEmail || !isValidEmail(normalizedEmail)) {
      return NextResponse.json({ message: "Please provide a valid email address" }, { status: 400 });
    }

    if (!consent) {
      return NextResponse.json({ message: "Consent is required to subscribe" }, { status: 400 });
    }

    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      if (existing.status !== "active") {
        await prisma.newsletterSubscriber.update({
          where: { id: existing.id },
          data: {
            status: "active",
            consent: true,
            source: body.source || existing.source,
            subscribedAt: new Date(),
          },
        });
      }

      await notifyWebhook({
        type: "newsletter.subscribe",
        email: normalizedEmail,
        source: body.source || "news-page",
        existing: true,
      });

      return NextResponse.json({ message: "Subscribed successfully" });
    }

    const subscriber = await prisma.newsletterSubscriber.create({
      data: {
        email: normalizedEmail,
        consent: true,
        source: body.source || "news-page",
        status: "active",
        subscribedAt: new Date(),
      },
    });

    await notifyWebhook({
      type: "newsletter.subscribe",
      email: subscriber.email,
      source: subscriber.source,
      existing: false,
    });

    return NextResponse.json({ message: "Subscribed successfully" }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to subscribe";
    return NextResponse.json({ message }, { status: 500 });
  }
}
