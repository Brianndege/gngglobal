import { NextRequest } from "next/server";
import { POST as postActions } from "@/app/api/admin/posts/actions/route";

const verifyAdminTokenMock = jest.fn();
const getBearerTokenMock = jest.fn(() => "token");

jest.mock("@/server/prisma", () => ({
  prisma: {
    post: {
      updateMany: jest.fn(async () => ({ count: 1 })),
      findMany: jest.fn(async () => []),
      create: jest.fn(async () => ({})),
      deleteMany: jest.fn(async () => ({})),
    },
  },
}));

jest.mock("@/server/auth", () => ({
  verifyAdminToken: (...args: unknown[]) => verifyAdminTokenMock(...args),
  getBearerToken: (...args: unknown[]) => getBearerTokenMock(...args),
}));

describe("security: admin rbac and session validation", () => {
  it("rejects non-admin publish attempts", async () => {
    verifyAdminTokenMock.mockReturnValue({ sub: "editor-1", role: "editor", email: "editor@market.test" });

    const request = new NextRequest("http://localhost/api/admin/posts/actions", {
      method: "POST",
      body: JSON.stringify({ action: "publish", ids: ["post-1"] }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await postActions(request);
    expect(response.status).toBe(403);
  });

  it("enforces authorization token requirement (session validation)", async () => {
    getBearerTokenMock.mockReturnValueOnce(null);

    const request = new NextRequest("http://localhost/api/admin/posts/actions", {
      method: "POST",
      body: JSON.stringify({ action: "archive", ids: ["post-1"] }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await postActions(request);
    expect(response.status).toBe(401);
  });

  it("rejects invalid token signature", async () => {
    verifyAdminTokenMock.mockImplementationOnce(() => {
      throw new Error("jwt malformed");
    });

    const request = new NextRequest("http://localhost/api/admin/posts/actions", {
      method: "POST",
      body: JSON.stringify({ action: "archive", ids: ["post-1"] }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await postActions(request);
    expect(response.status).toBe(401);
  });

  it("api mutation routes require bearer auth as CSRF boundary", async () => {
    getBearerTokenMock.mockReturnValueOnce(null);

    const request = new NextRequest("http://localhost/api/admin/posts/actions", {
      method: "POST",
      body: JSON.stringify({ action: "delete", ids: ["post-1"] }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await postActions(request);
    expect(response.status).toBe(401);
  });
});
