/** @jest-environment jsdom */

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import PostEditorForm from "@/components/admin/PostEditorForm";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}));

jest.mock("@/lib/adminAuth", () => ({
  getAdminAuthHeaders: () => ({ Authorization: "Bearer token" }),
}));

describe("ui: PostEditorForm", () => {
  beforeEach(() => {
    global.fetch = jest.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes("/api/admin/posts") && !url.includes("action=autosave")) {
        return new Response(JSON.stringify({ posts: [], authors: [] }), { status: 200 });
      }
      if (url.includes("/api/admin/media")) {
        return new Response(JSON.stringify({ items: [] }), { status: 200 });
      }
      return new Response(JSON.stringify({ post: { _id: "1" } }), { status: 201 });
    }) as jest.Mock;
  });

  it("renders key editor sections", async () => {
    render(<PostEditorForm mode="create" canPublish />);

    expect(screen.getByText("Content Workspace")).toBeInTheDocument();
    expect(screen.getByText("Editor")).toBeInTheDocument();
    expect(screen.getByText("Media Management")).toBeInTheDocument();
    expect(screen.getByText("SEO + OpenGraph + Twitter")).toBeInTheDocument();
  });

  it("submits create post payload", async () => {
    render(<PostEditorForm mode="create" canPublish />);

    const textboxes = screen.getAllByRole("textbox");
    fireEvent.change(textboxes[0], { target: { value: "QA Test Post" } });
    fireEvent.change(textboxes[3], { target: { value: "qa-test-post" } });

    const createButton = screen.getByRole("button", { name: "Create Post" });
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });
});
