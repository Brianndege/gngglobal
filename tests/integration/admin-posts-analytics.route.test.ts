import { NextRequest } from "next/server";
import { GET } from "@/app/api/admin/posts/analytics/route";

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

describe("integration: admin posts analytics route", () => {
  it("calculates totals and engagement", async () => {
    verifyAdminTokenMock.mockReturnValue({ sub: "a1", role: "admin", email: "admin@test.com" });
    findManyMock.mockResolvedValue([
      { id: "p1", title: "A", slug: "a", viewCount: 100, likeCount: 20, commentCount: 5, referralSources: { search: 40 } },
      { id: "p2", title: "B", slug: "b", viewCount: 50, likeCount: 5, commentCount: 5, referralSources: { direct: 30 } },
    ]);

    const response = await GET(new NextRequest("http://localhost/api/admin/posts/analytics"));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.totals.views).toBe(150);
    expect(payload.engagementRate).toBeCloseTo(23.33, 1);
    expect(payload.referralSources.search).toBe(40);
  });

  it("handles empty dataset edge case", async () => {
    verifyAdminTokenMock.mockReturnValue({ sub: "a1", role: "admin", email: "admin@test.com" });
    findManyMock.mockResolvedValue([]);

    const response = await GET(new NextRequest("http://localhost/api/admin/posts/analytics"));
    const payload = await response.json();

    expect(payload.engagementRate).toBe(0);
    expect(payload.popularPosts).toHaveLength(0);
  });

  it("returns 500 on internal error", async () => {
    verifyAdminTokenMock.mockReturnValue({ sub: "a1", role: "admin", email: "admin@test.com" });
    findManyMock.mockRejectedValueOnce(new Error("db fail"));

    const response = await GET(new NextRequest("http://localhost/api/admin/posts/analytics"));
    expect(response.status).toBe(500);
  });
});
