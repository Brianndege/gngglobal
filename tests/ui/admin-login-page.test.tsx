/** @jest-environment jsdom */

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import AdminLoginPage from "@/app/admin/login/page";

const pushMock = jest.fn();
const saveTokenMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: (...args: unknown[]) => pushMock(...args),
  }),
}));

jest.mock("@/lib/cms", () => ({
  getCmsApiBaseUrl: () => "",
}));

jest.mock("@/lib/adminAuth", () => ({
  saveAdminToken: (...args: unknown[]) => saveTokenMock(...args),
}));

describe("ui: admin login page", () => {
  it("logs in successfully and redirects", async () => {
    global.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => ({ token: "jwt-token" }),
    } as Response)) as jest.Mock;

    render(<AdminLoginPage />);

    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "admin@test.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "password" } });
    fireEvent.click(screen.getByRole("button", { name: "Sign In" }));

    await waitFor(() => {
      expect(saveTokenMock).toHaveBeenCalledWith("jwt-token");
      expect(pushMock).toHaveBeenCalledWith("/admin/dashboard");
    });
  });

  it("shows error message on invalid credentials", async () => {
    global.fetch = jest.fn(async () => ({ ok: false } as Response)) as jest.Mock;

    render(<AdminLoginPage />);

    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "admin@test.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "bad" } });
    fireEvent.click(screen.getByRole("button", { name: "Sign In" }));

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });
  });
});
