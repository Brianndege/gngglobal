import { NextRequest } from "next/server";
import { PATCH } from "@/app/api/admin/contact-messages/[id]/route";

const verifyAdminTokenMock = jest.fn();
const getBearerTokenMock = jest.fn(() => "token");
const findUniqueMock = jest.fn();
const updateMock = jest.fn();

jest.mock("@/server/auth", () => ({
  verifyAdminToken: (...args: unknown[]) => verifyAdminTokenMock(...args),
  getBearerToken: (...args: unknown[]) => getBearerTokenMock(...args),
}));

jest.mock("@/server/prisma", () => ({
  prisma: {
    contactMessage: {
      findUnique: (...args: unknown[]) => findUniqueMock(...args),
      update: (...args: unknown[]) => updateMock(...args),
    },
  },
}));

describe("integration: admin contact-message by id route", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    verifyAdminTokenMock.mockReturnValue({ sub: "admin-1", email: "admin@test.com", role: "admin" });
  });

  it("returns 401 when token is missing", async () => {
    getBearerTokenMock.mockReturnValueOnce(null);

    const request = new NextRequest("http://localhost/api/admin/contact-messages/m-1", {
      method: "PATCH",
      body: JSON.stringify({ status: "responded", responseNotes: "done" }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await PATCH(request, { params: Promise.resolve({ id: "m-1" }) });
    expect(response.status).toBe(401);
  });

  it("returns 404 when message does not exist", async () => {
    findUniqueMock.mockResolvedValueOnce(null);

    const request = new NextRequest("http://localhost/api/admin/contact-messages/m-404", {
      method: "PATCH",
      body: JSON.stringify({ status: "responded", responseNotes: "done" }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await PATCH(request, { params: Promise.resolve({ id: "m-404" }) });
    expect(response.status).toBe(404);
  });

  it("returns 400 for invalid status", async () => {
    findUniqueMock.mockResolvedValueOnce({ id: "m-1" });

    const request = new NextRequest("http://localhost/api/admin/contact-messages/m-1", {
      method: "PATCH",
      body: JSON.stringify({ status: "invalid", responseNotes: "done" }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await PATCH(request, { params: Promise.resolve({ id: "m-1" }) });
    expect(response.status).toBe(400);
  });

  it("updates status and notes", async () => {
    findUniqueMock.mockResolvedValueOnce({ id: "m-1" });
    updateMock.mockResolvedValueOnce({
      id: "m-1",
      name: "Sam",
      email: "sam@example.com",
      phone: "",
      company: "",
      message: "Hi",
      status: "responded",
      responseNotes: "Handled",
      respondedAt: new Date("2026-02-02T00:00:00.000Z"),
      source: "website",
      createdAt: new Date("2026-02-01T00:00:00.000Z"),
      updatedAt: new Date("2026-02-02T00:00:00.000Z"),
    });

    const request = new NextRequest("http://localhost/api/admin/contact-messages/m-1", {
      method: "PATCH",
      body: JSON.stringify({ status: "responded", responseNotes: "Handled" }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await PATCH(request, { params: Promise.resolve({ id: "m-1" }) });
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.message._id).toBe("m-1");
    expect(updateMock).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "m-1" },
        data: expect.objectContaining({ status: "responded", responseNotes: "Handled" }),
      })
    );
  });
});
