import { POST } from "@/app/api/admin/login/route";
import { sampleAdmin } from "../mocks/fixtures";

jest.mock("@/server/prisma", () => ({
  prisma: {
    adminUser: {
      findUnique: jest.fn(),
    },
  },
}));
const compareMock = jest.fn(async () => true);
jest.mock("bcryptjs", () => ({ compare: (...args: unknown[]) => compareMock(...args) }));
jest.mock("jsonwebtoken", () => ({ sign: jest.fn(() => "signed-token") }));

const prismaModule = jest.requireMock("@/server/prisma") as {
  prisma: { adminUser: { findUnique: jest.Mock } };
};
const prismaMock = prismaModule.prisma;

describe("integration: admin login route", () => {
  beforeEach(() => {
    process.env.JWT_SECRET = "test-secret";
    prismaMock.adminUser.findUnique.mockResolvedValue(sampleAdmin);
  });

  it("authenticates valid admin credentials", async () => {
    const request = new Request("http://localhost/api/admin/login", {
      method: "POST",
      body: JSON.stringify({ email: sampleAdmin.email, password: "password" }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.token).toBe("signed-token");
    expect(payload.admin.email).toBe(sampleAdmin.email);
  });

  it("returns 401 for unknown admin", async () => {
    prismaMock.adminUser.findUnique.mockResolvedValue(null);

    const request = new Request("http://localhost/api/admin/login", {
      method: "POST",
      body: JSON.stringify({ email: "x@y.com", password: "password" }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    expect(response.status).toBe(401);
  });

  it("returns 401 for invalid password", async () => {
    prismaMock.adminUser.findUnique.mockResolvedValue(sampleAdmin);
    compareMock.mockResolvedValueOnce(false);

    const request = new Request("http://localhost/api/admin/login", {
      method: "POST",
      body: JSON.stringify({ email: sampleAdmin.email, password: "bad-password" }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    expect(response.status).toBe(401);
  });

  it("returns 500 for unhandled exceptions", async () => {
    prismaMock.adminUser.findUnique.mockRejectedValueOnce(new Error("db crash"));

    const request = new Request("http://localhost/api/admin/login", {
      method: "POST",
      body: JSON.stringify({ email: sampleAdmin.email, password: "password" }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    expect(response.status).toBe(500);
  });
});
