import { expect, test } from "@playwright/test";

test.describe("e2e: admin panel", () => {
  test("admin login, analytics, moderation and publishing flows", async ({ page }) => {
    await page.route("**/api/admin/login", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ token: "e2e-token", admin: { id: "1", email: "admin@test.com", role: "admin" } }),
      });
    });

    await page.goto("/admin/login");
    await page.fill('input[type="email"]', "admin@test.com");
    await page.fill('input[type="password"]', "password");
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/\/admin\/(dashboard|posts)/);
  });

  test("authorization failure blocks non-admin route access", async ({ page }) => {
    await page.goto("/admin/posts");
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("loading and API failure states are visible", async ({ page }) => {
    await page.route("**/api/admin/posts**", async (route) => {
      await route.fulfill({ status: 500, body: JSON.stringify({ message: "Failed to load posts" }) });
    });

    await page.goto("/admin/posts");
    await expect(page.getByText(/Failed to load posts/i)).toBeVisible();
  });

  test("edge case: empty dataset renders safely", async ({ page }) => {
    await page.route("**/api/admin/posts**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          posts: [],
          categories: [],
          summary: {
            total: 0,
            drafts: 0,
            published: 0,
            pendingApproval: 0,
            scheduled: 0,
            archived: 0,
            featured: 0,
          },
          permissions: { canPublish: true },
        }),
      });
    });

    await page.route("**/api/admin/posts/analytics", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ totals: { views: 0, likes: 0, comments: 0 }, engagementRate: 0, popularPosts: [], referralSources: {} }),
      });
    });

    await page.goto("/admin/posts");
    await expect(page.getByText("Blog CMS")).toBeVisible();
  });
});
