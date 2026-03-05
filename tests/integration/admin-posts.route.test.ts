import { NextRequest } from "next/server";
import { GET } from "@/app/api/admin/posts/route";
import { samplePost, sampleAdmin } from "../mocks/fixtures";

jest.mock("@/server/prisma", () => ({
  prisma: {
    post: {
      findMany: jest.fn(),
    },
    adminUser: {
      findMany: jest.fn(),
    },
  },
}));

const verifyAdminTokenMock = jest.fn();
const getBearerTokenMock = jest.fn(() => "token");

jest.mock("@/server/auth", () => ({
  verifyAdminToken: (...args: unknown[]) => verifyAdminTokenMock(...args),
  getBearerToken: (...args: unknown[]) => getBearerTokenMock(...args),
}));

const prismaModule = jest.requireMock("@/server/prisma") as {
  prisma: {
    post: { findMany: jest.Mock };
    adminUser: { findMany: jest.Mock };
  };
};
const prismaMock = prismaModule.prisma;

describe("integration: admin posts route", () => {
  beforeEach(() => {
    verifyAdminTokenMock.mockReturnValue({ sub: sampleAdmin.id, email: sampleAdmin.email, role: "admin" });
    prismaMock.post.findMany.mockResolvedValue([
      {
        ...samplePost,
        _count: { revisions: 2 },
        author: { id: sampleAdmin.id, name: sampleAdmin.name, email: sampleAdmin.email },
        assignedAuthor: null,
      },
    ]);
    prismaMock.adminUser.findMany.mockResolvedValue([sampleAdmin]);
  });

  it("returns list with summary and permissions", async () => {
    const req = new NextRequest("http://localhost/api/admin/posts?search=marketplace", { method: "GET" });

    const response = await GET(req);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.posts).toHaveLength(1);
    expect(payload.summary.total).toBe(1);
    expect(payload.permissions.canPublish).toBe(true);
  });

  it("returns 401 when token verification fails", async () => {
    verifyAdminTokenMock.mockImplementationOnce(() => {
      throw new Error("invalid");
    });

    const req = new NextRequest("http://localhost/api/admin/posts", { method: "GET" });
    const response = await GET(req);
    expect(response.status).toBe(401);
  });
});
