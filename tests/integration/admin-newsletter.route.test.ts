import { NextRequest } from "next/server";
import { GET } from "@/app/api/admin/newsletter/route";

const verifyAdminTokenMock = jest.fn();
const getBearerTokenMock = jest.fn(() => "token");
const findManyMock = jest.fn();
const countMock = jest.fn();

jest.mock("@/server/auth", () => ({
  verifyAdminToken: (...args: unknown[]) => verifyAdminTokenMock(...args),
  getBearerToken: (...args: unknown[]) => getBearerTokenMock(...args),
}));

jest.mock("@/server/prisma", () => ({
  prisma: {
    newsletterSubscriber: {
      findMany: (...args: unknown[]) => findManyMock(...args),
      count: (...args: unknown[]) => countMock(...args),
    },
  },
}));

describe("integration: admin newsletter route", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    verifyAdminTokenMock.mockReturnValue({ sub: "admin-1", email: "admin@test.com", role: "admin" });
  });

  it("returns 401 without token", async () => {
    getBearerTokenMock.mockReturnValueOnce(null);

    const response = await GET(new NextRequest("http://localhost/api/admin/newsletter", { method: "GET" }));
    expect(response.status).toBe(401);
  });

  it("returns filtered subscribers", async () => {
    findManyMock.mockResolvedValueOnce([
      {
        id: "s-1",
        email: "sub@example.com",
        source: "news",
        consent: true,
        status: "active",
        subscribedAt: new Date("2026-01-01T00:00:00.000Z"),
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
        updatedAt: new Date("2026-01-01T00:00:00.000Z"),
      },
    ]);
    countMock.mockResolvedValueOnce(1);

    const response = await GET(new NextRequest("http://localhost/api/admin/newsletter?page=1&limit=50&status=active&q=sub", { method: "GET" }));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.subscribers).toHaveLength(1);
    expect(payload.pagination.total).toBe(1);
    expect(findManyMock).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          status: "active",
          email: { contains: "sub", mode: "insensitive" },
        },
      })
    );
  });

  it("returns 500 on query failure", async () => {
    findManyMock.mockRejectedValueOnce(new Error("db error"));

    const response = await GET(new NextRequest("http://localhost/api/admin/newsletter", { method: "GET" }));
    expect(response.status).toBe(500);
  });
});
