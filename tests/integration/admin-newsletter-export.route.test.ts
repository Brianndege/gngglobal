import { NextRequest } from "next/server";
import { GET } from "@/app/api/admin/newsletter/export.csv/route";

const verifyAdminTokenMock = jest.fn();
const getBearerTokenMock = jest.fn(() => "token");
const findManyMock = jest.fn();

jest.mock("@/server/auth", () => ({
  verifyAdminToken: (...args: unknown[]) => verifyAdminTokenMock(...args),
  getBearerToken: (...args: unknown[]) => getBearerTokenMock(...args),
}));

jest.mock("@/server/prisma", () => ({
  prisma: {
    newsletterSubscriber: {
      findMany: (...args: unknown[]) => findManyMock(...args),
    },
  },
}));

describe("integration: admin newsletter export route", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    verifyAdminTokenMock.mockReturnValue({ sub: "admin-1", email: "admin@test.com", role: "admin" });
  });

  it("returns 401 when unauthenticated", async () => {
    getBearerTokenMock.mockReturnValueOnce(null);

    const response = await GET(new NextRequest("http://localhost/api/admin/newsletter/export.csv", { method: "GET" }));
    expect(response.status).toBe(401);
  });

  it("returns csv export", async () => {
    findManyMock.mockResolvedValueOnce([
      {
        email: "a@example.com",
        status: "active",
        consent: true,
        source: "website",
        subscribedAt: new Date("2026-01-01T00:00:00.000Z"),
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
        updatedAt: new Date("2026-01-01T00:00:00.000Z"),
      },
    ]);

    const response = await GET(new NextRequest("http://localhost/api/admin/newsletter/export.csv?status=active&q=a", { method: "GET" }));
    const text = await response.text();

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toContain("text/csv");
    expect(text).toContain("email,status,consent,source");
    expect(text).toContain("a@example.com");
  });

  it("returns 500 when export fails", async () => {
    findManyMock.mockRejectedValueOnce(new Error("db fail"));

    const response = await GET(new NextRequest("http://localhost/api/admin/newsletter/export.csv", { method: "GET" }));
    expect(response.status).toBe(500);
  });
});
