import { prisma } from "../config/prisma.js";

function isValidEmail(email) {
  return /^\S+@\S+\.\S+$/.test(email);
}

async function notifyWebhook(payload) {
  const webhookUrl = process.env.NEWSLETTER_WEBHOOK_URL;
  if (!webhookUrl) return;

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch {
    // best-effort webhook delivery
  }
}

export async function subscribeNewsletter(req, res, next) {
  try {
    const { email, consent, source, website } = req.body;

    if (website) {
      return res.status(200).json({ message: "Subscribed successfully" });
    }

    const normalizedEmail = String(email || "").toLowerCase().trim();

    if (!normalizedEmail || !isValidEmail(normalizedEmail)) {
      return res.status(400).json({ message: "Please provide a valid email address" });
    }

    if (String(consent) !== "true") {
      return res.status(400).json({ message: "Consent is required to subscribe" });
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
            source: source || existing.source,
            subscribedAt: new Date(),
          },
        });
      }

      await notifyWebhook({
        type: "newsletter.subscribe",
        email: normalizedEmail,
        source: source || "news-page",
        existing: true,
      });

      return res.status(200).json({ message: "Subscribed successfully" });
    }

    const subscriber = await prisma.newsletterSubscriber.create({
      data: {
        email: normalizedEmail,
        consent: true,
        source: source || "news-page",
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

    return res.status(201).json({ message: "Subscribed successfully" });
  } catch (error) {
    return next(error);
  }
}
