import { NextRequest } from "next/server";
import { POST } from "@/app/api/admin/contact-messages/test-notification/route";

const verifyAdminTokenMock = jest.fn();
const getBearerTokenMock = jest.fn(() => "token");
const sendMailMock = jest.fn();
const createTransportMock = jest.fn(() => ({ sendMail: (...args: unknown[]) => sendMailMock(...args) }));

jest.mock("@/server/auth", () => ({
  verifyAdminToken: (...args: unknown[]) => verifyAdminTokenMock(...args),
  getBearerToken: (...args: unknown[]) => getBearerTokenMock(...args),
}));

jest.mock("nodemailer", () => ({
  __esModule: true,
  default: {
    createTransport: (...args: unknown[]) => createTransportMock(...args),
  },
}));

describe("integration: admin contact test notification route", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = {
      ...originalEnv,
      SMTP_HOST: "smtp.example.com",
      SMTP_PORT: "587",
      SMTP_SECURE: "false",
      SMTP_USER: "mailer@example.com",
      SMTP_PASS: "secret",
      CONTACT_NOTIFY_TO: "ops@example.com",
      CONTACT_NOTIFY_FROM: "notify@example.com",
    };
    verifyAdminTokenMock.mockReturnValue({ sub: "admin-1", email: "admin@test.com", role: "admin" });
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("returns 401 when unauthenticated", async () => {
    getBearerTokenMock.mockReturnValueOnce(null);

    const response = await POST(new NextRequest("http://localhost/api/admin/contact-messages/test-notification", { method: "POST" }));
    expect(response.status).toBe(401);
  });

  it("returns 400 when smtp is not configured", async () => {
    delete process.env.SMTP_HOST;

    const response = await POST(new NextRequest("http://localhost/api/admin/contact-messages/test-notification", { method: "POST" }));
    expect(response.status).toBe(400);
  });

  it("sends a test email", async () => {
    sendMailMock.mockResolvedValueOnce({ messageId: "ok" });

    const response = await POST(new NextRequest("http://localhost/api/admin/contact-messages/test-notification", { method: "POST" }));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.message).toContain("sent");
    expect(sendMailMock).toHaveBeenCalled();
  });
});
