import { NextRequest } from "next/server";
import { GET } from "@/app/api/admin/media/route";

const verifyAdminTokenMock = jest.fn();
const getBearerTokenMock = jest.fn(() => "token");
const findManyMock = jest.fn();

jest.mock("@/server/auth", () => ({
  verifyAdminToken: (...args: unknown[]) => verifyAdminTokenMock(...args),
  getBearerToken: (...args: unknown[]) => getBearerTokenMock(...args),
}));

jest.mock("@/server/prisma", () => ({
  prisma: {
    post: {
      findMany: (...args: unknown[]) => findManyMock(...args),
    },
  },
}));

describe("integration: admin media route", () => {
  it("returns 401 when unauthenticated", async () => {
    getBearerTokenMock.mockReturnValueOnce(null);
    const response = await GET(new NextRequest("http://localhost/api/admin/media"));
    expect(response.status).toBe(401);
  });

  it("returns media items", async () => {
    verifyAdminTokenMock.mockReturnValue({ sub: "a1", role: "admin", email: "admin@test.com" });
    findManyMock.mockResolvedValue([{ id: "p1", title: "Post", featuredImageUrl: "https://cdn/a.jpg", featuredImageAlt: "alt", updatedAt: new Date() }]);

    const response = await GET(new NextRequest("http://localhost/api/admin/media"));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.items).toHaveLength(1);
    expect(payload.items[0].url).toContain("https://cdn/a.jpg");
  });

  it("returns 500 on database failure", async () => {
    verifyAdminTokenMock.mockReturnValue({ sub: "a1", role: "admin", email: "admin@test.com" });
    findManyMock.mockRejectedValueOnce(new Error("db down"));

    const response = await GET(new NextRequest("http://localhost/api/admin/media"));
    expect(response.status).toBe(500);
  });
});
