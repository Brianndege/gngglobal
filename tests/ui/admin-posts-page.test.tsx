/** @jest-environment jsdom */

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import AdminPostsPage from "@/app/admin/posts/page";

const replaceMock = jest.fn();
const getAdminTokenMock = jest.fn(() => "token");

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: (...args: unknown[]) => replaceMock(...args),
  }),
}));

jest.mock("@/lib/adminAuth", () => ({
  getAdminToken: (...args: unknown[]) => getAdminTokenMock(...args),
  getAdminAuthHeaders: () => ({ Authorization: "Bearer token" }),
  clearAdminToken: jest.fn(),
}));

const postsPayload = {
  posts: [
    {
      _id: "post-1",
      title: "Spring Marketplace Trends",
      slug: "spring-marketplace-trends",
      category: "Ecommerce",
      tags: ["marketplace"],
      status: "draft",
      workflowStatus: "review",
      updatedAt: "2026-03-05T09:00:00.000Z",
      revisionCount: 2,
    },
  ],
  categories: ["Ecommerce"],
  summary: {
    total: 1,
    drafts: 1,
    published: 0,
    pendingApproval: 1,
    scheduled: 0,
    archived: 0,
    featured: 0,
  },
  permissions: { canPublish: true },
};

const analyticsPayload = {
  totals: { views: 1000, likes: 120, comments: 30 },
  engagementRate: 15,
  popularPosts: [{ id: "post-1", title: "Spring Marketplace Trends", viewCount: 1000, likeCount: 120, commentCount: 30 }],
  referralSources: { direct: 500, search: 300, social: 200 },
};

describe("ui: AdminPostsPage", () => {
  beforeEach(() => {
    replaceMock.mockReset();
    getAdminTokenMock.mockReturnValue("token");

    global.fetch = jest.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes("/api/admin/posts/analytics")) {
        return {
          ok: true,
          status: 200,
          json: async () => analyticsPayload,
        } as Response;
      }
      return {
        ok: true,
        status: 200,
        json: async () => postsPayload,
      } as Response;
    }) as jest.Mock;
  });

  it("renders table, analytics and filters", async () => {
    render(<AdminPostsPage />);

    await waitFor(() => {
      expect(screen.getByText("Blog CMS")).toBeInTheDocument();
    });

    expect(screen.getByText("Blog Analytics")).toBeInTheDocument();
    expect(screen.getAllByText("Spring Marketplace Trends").length).toBeGreaterThan(0);

    fireEvent.change(screen.getByPlaceholderText("Search title, slug, tag"), { target: { value: "spring" } });
    expect((screen.getByPlaceholderText("Search title, slug, tag") as HTMLInputElement).value).toBe("spring");
  });

  it("redirects to login when token is missing", async () => {
    getAdminTokenMock.mockReturnValueOnce(null);
    render(<AdminPostsPage />);

    await waitFor(() => {
      expect(replaceMock).toHaveBeenCalledWith("/admin/login");
    });
  });

  it("shows API error state", async () => {
    global.fetch = jest.fn(async () => ({ ok: false, status: 500, json: async () => ({ message: "Failed to load posts" }) } as Response)) as jest.Mock;

    render(<AdminPostsPage />);

    await waitFor(() => {
      expect(screen.getByText(/Failed to load posts/i)).toBeInTheDocument();
    });
  });

  it("performs bulk archive action for selected rows", async () => {
    global.fetch = jest.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes("/api/admin/posts/actions")) {
        return { ok: true, status: 200, json: async () => ({ ok: true }) } as Response;
      }
      if (url.includes("/api/admin/posts/analytics")) {
        return { ok: true, status: 200, json: async () => analyticsPayload } as Response;
      }
      return { ok: true, status: 200, json: async () => postsPayload } as Response;
    }) as jest.Mock;

    render(<AdminPostsPage />);

    await waitFor(() => {
      expect(screen.getAllByText("Spring Marketplace Trends").length).toBeGreaterThan(0);
    });

    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[1]);
    fireEvent.click(screen.getAllByRole("button", { name: "Archive" })[0]);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/admin/posts/actions"),
        expect.objectContaining({ method: "POST" })
      );
    });
  });

  it("toggles archived filters and refetches list", async () => {
    render(<AdminPostsPage />);

    await waitFor(() => {
      expect(screen.getByText("Blog CMS")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: "Archived" }));
    fireEvent.click(screen.getByRole("button", { name: "All" }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("archived=all"), expect.anything());
    });
  });

  it("executes per-row duplicate and archive actions", async () => {
    global.fetch = jest.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes("/api/admin/posts/actions")) {
        return { ok: true, status: 200, json: async () => ({ ok: true }) } as Response;
      }
      if (url.includes("/api/admin/posts/analytics")) {
        return { ok: true, status: 200, json: async () => analyticsPayload } as Response;
      }
      return { ok: true, status: 200, json: async () => postsPayload } as Response;
    }) as jest.Mock;

    render(<AdminPostsPage />);

    await waitFor(() => {
      expect(screen.getAllByText("Spring Marketplace Trends").length).toBeGreaterThan(0);
    });

    fireEvent.click(screen.getAllByRole("button", { name: "Duplicate" })[0]);
    fireEvent.click(screen.getAllByRole("button", { name: "Archive" })[0]);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/admin/posts/actions"),
        expect.objectContaining({ method: "POST" })
      );
    });
  });
});
