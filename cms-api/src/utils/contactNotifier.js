import nodemailer from "nodemailer";

let cachedTransporter;

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
    auth: {
      user,
      pass,
    },
  });
}

function getTransporter() {
  if (cachedTransporter !== undefined) {
    return cachedTransporter;
  }

  cachedTransporter = createTransporter();
  return cachedTransporter;
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function notifyNewContactMessage(message) {
  const transporter = getTransporter();
  const to = process.env.CONTACT_NOTIFY_TO;
  const from = process.env.CONTACT_NOTIFY_FROM || process.env.SMTP_FROM || process.env.SMTP_USER;

  if (!transporter || !to || !from) {
    return;
  }

  const createdAt = message.createdAt ? new Date(message.createdAt).toLocaleString("en-AU") : new Date().toLocaleString("en-AU");
  const subject = `New contact message from ${message.name}`;

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

  const html = `
    <h2>New Contact Message</h2>
    <p><strong>Name:</strong> ${escapeHtml(message.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(message.email)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(message.phone || "-")}</p>
    <p><strong>Company:</strong> ${escapeHtml(message.company || "-")}</p>
    <p><strong>Received:</strong> ${escapeHtml(createdAt)}</p>
    <hr />
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(message.message).replace(/\n/g, "<br />")}</p>
  `;

  try {
    await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
      replyTo: message.email,
    });
  } catch {
    // best-effort notifications; do not fail contact submission
  }
}

export async function sendContactNotificationTest() {
  const transporter = getTransporter();
  const to = process.env.CONTACT_NOTIFY_TO;
  const from = process.env.CONTACT_NOTIFY_FROM || process.env.SMTP_FROM || process.env.SMTP_USER;

  if (!transporter || !to || !from) {
    throw new Error("SMTP is not configured. Please set SMTP and CONTACT_NOTIFY_* environment values.");
  }

  const sentAt = new Date().toLocaleString("en-AU");

  await transporter.sendMail({
    from,
    to,
    subject: "GNG Contact Notifications: Test Email",
    text: `This is a test contact notification email sent at ${sentAt}.`,
    html: `<p>This is a test contact notification email sent at <strong>${escapeHtml(sentAt)}</strong>.</p>`,
  });
}
