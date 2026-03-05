import { NextRequest } from "next/server";
import { POST } from "@/app/api/admin/posts/actions/route";
import { samplePost } from "../mocks/fixtures";

jest.mock("@/server/prisma", () => ({
  prisma: {
    post: {
      findMany: jest.fn(),
      create: jest.fn(),
      updateMany: jest.fn(),
      deleteMany: jest.fn(),
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
    post: {
      findMany: jest.Mock;
      create: jest.Mock;
      updateMany: jest.Mock;
      deleteMany: jest.Mock;
    };
  };
};
const prismaMock = prismaModule.prisma;

describe("integration: admin posts bulk actions", () => {
  it("returns 401 when token is missing", async () => {
    getBearerTokenMock.mockReturnValueOnce(null);
    const req = new NextRequest("http://localhost/api/admin/posts/actions", { method: "POST", body: JSON.stringify({ action: "archive", ids: ["1"] }) });

    const response = await POST(req);
    expect(response.status).toBe(401);
  });

  it("blocks editor from publishing", async () => {
    verifyAdminTokenMock.mockReturnValueOnce({ sub: "e1", role: "editor", email: "editor@test.com" });

    const req = new NextRequest("http://localhost/api/admin/posts/actions", {
      method: "POST",
      body: JSON.stringify({ action: "publish", ids: ["post-1"] }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(req);
    expect(response.status).toBe(403);
  });

  it("duplicates selected posts", async () => {
    verifyAdminTokenMock.mockReturnValue({ sub: "a1", role: "admin", email: "admin@test.com" });
    prismaMock.post.findMany.mockResolvedValue([{ ...samplePost, mediaLibrary: null, referralSources: null }]);
    prismaMock.post.create.mockResolvedValue({ ...samplePost, id: "post-2", title: `${samplePost.title} (Copy)` });

    const req = new NextRequest("http://localhost/api/admin/posts/actions", {
      method: "POST",
      body: JSON.stringify({ action: "duplicate", ids: [samplePost.id] }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(req);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.posts).toHaveLength(1);
    expect(prismaMock.post.create).toHaveBeenCalledTimes(1);
  });

  it("handles duplicate action when source list is empty", async () => {
    verifyAdminTokenMock.mockReturnValue({ sub: "a1", role: "admin", email: "admin@test.com" });
    prismaMock.post.findMany.mockResolvedValueOnce([]);

    const req = new NextRequest("http://localhost/api/admin/posts/actions", {
      method: "POST",
      body: JSON.stringify({ action: "duplicate", ids: ["missing-post"] }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(req);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.posts).toEqual([]);
  });

  it("archives selected posts", async () => {
    verifyAdminTokenMock.mockReturnValue({ sub: "a1", role: "admin", email: "admin@test.com" });
    prismaMock.post.updateMany.mockResolvedValue({ count: 2 });

    const req = new NextRequest("http://localhost/api/admin/posts/actions", {
      method: "POST",
      body: JSON.stringify({ action: "archive", ids: ["post-1", "post-2"] }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(req);
    expect(response.status).toBe(200);
  });

  it("publishes selected posts for admin role", async () => {
    verifyAdminTokenMock.mockReturnValue({ sub: "a1", role: "admin", email: "admin@test.com" });
    prismaMock.post.updateMany.mockResolvedValue({ count: 1 });

    const req = new NextRequest("http://localhost/api/admin/posts/actions", {
      method: "POST",
      body: JSON.stringify({ action: "publish", ids: ["post-1"] }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(req);
    expect(response.status).toBe(200);
  });

  it("moves selected posts to review", async () => {
    verifyAdminTokenMock.mockReturnValue({ sub: "a1", role: "admin", email: "admin@test.com" });
    prismaMock.post.updateMany.mockResolvedValue({ count: 1 });

    const req = new NextRequest("http://localhost/api/admin/posts/actions", {
      method: "POST",
      body: JSON.stringify({ action: "moveToReview", ids: ["post-1"] }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(req);
    expect(response.status).toBe(200);
  });

  it("deletes selected posts", async () => {
    verifyAdminTokenMock.mockReturnValue({ sub: "a1", role: "admin", email: "admin@test.com" });
    prismaMock.post.deleteMany.mockResolvedValue({ count: 1 });

    const req = new NextRequest("http://localhost/api/admin/posts/actions", {
      method: "POST",
      body: JSON.stringify({ action: "delete", ids: ["post-1"] }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(req);
    expect(response.status).toBe(200);
  });

  it("returns 400 for missing action or ids", async () => {
    verifyAdminTokenMock.mockReturnValue({ sub: "a1", role: "admin", email: "admin@test.com" });

    const req = new NextRequest("http://localhost/api/admin/posts/actions", {
      method: "POST",
      body: JSON.stringify({ ids: [] }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(req);
    expect(response.status).toBe(400);
  });

  it("returns 400 for unsupported action", async () => {
    verifyAdminTokenMock.mockReturnValue({ sub: "a1", role: "admin", email: "admin@test.com" });

    const req = new NextRequest("http://localhost/api/admin/posts/actions", {
      method: "POST",
      body: JSON.stringify({ action: "unknown", ids: ["post-1"] }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(req);
    expect(response.status).toBe(400);
  });

  it("returns 500 when action processing throws", async () => {
    verifyAdminTokenMock.mockReturnValue({ sub: "a1", role: "admin", email: "admin@test.com" });
    prismaMock.post.updateMany.mockRejectedValueOnce(new Error("db failure"));

    const req = new NextRequest("http://localhost/api/admin/posts/actions", {
      method: "POST",
      body: JSON.stringify({ action: "archive", ids: ["post-1"] }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(req);
    expect(response.status).toBe(500);
  });
});
