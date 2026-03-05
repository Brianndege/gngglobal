"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { clearAdminToken, getAdminAuthHeaders, getAdminToken } from "@/lib/adminAuth";
import { CmsPost, getCmsApiBaseUrl } from "@/lib/cms";

interface PostsResponse {
  posts: Array<CmsPost & { revisionCount?: number }>;
  categories: string[];
  summary: {
    total: number;
    drafts: number;
    published: number;
    pendingApproval: number;
    scheduled: number;
    archived: number;
    featured: number;
  };
  permissions?: { canPublish?: boolean };
}

interface AnalyticsResponse {
  totals: { views: number; likes: number; comments: number };
  engagementRate: number;
  popularPosts: Array<{ id: string; title: string; viewCount: number; likeCount: number; commentCount: number }>;
  referralSources: Record<string, number>;
}

function statusChip(post: CmsPost) {
  if (post.workflowStatus === "review") return "bg-amber-100 text-amber-800";
  if (post.workflowStatus === "archived") return "bg-slate-200 text-slate-700";
  if (post.status === "published") return "bg-emerald-100 text-emerald-800";
  return "bg-ivory-200 text-charcoal-700";
}

export default function AdminPostsPage() {
  const router = useRouter();
  const [rows, setRows] = useState<Array<CmsPost & { revisionCount?: number }>>([]);
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [summary, setSummary] = useState<PostsResponse["summary"] | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [canPublish, setCanPublish] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [workflow, setWorkflow] = useState("");
  const [archived, setArchived] = useState<"active" | "all" | "archived">("active");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiBase = getCmsApiBaseUrl();

  async function load() {
    try {
      const query = new URLSearchParams();
      if (search.trim()) query.set("search", search.trim());
      if (category) query.set("category", category);
      if (status) query.set("status", status);
      if (workflow) query.set("workflow", workflow);
      query.set("archived", archived);

      const [postsResponse, analyticsResponse] = await Promise.all([
        fetch(`${apiBase}/api/admin/posts?${query.toString()}`, { headers: { ...getAdminAuthHeaders() } }),
        fetch(`${apiBase}/api/admin/posts/analytics`, { headers: { ...getAdminAuthHeaders() } }),
      ]);

      if (postsResponse.status === 401) {
        clearAdminToken();
        router.replace("/admin/login");
        return;
      }

      if (!postsResponse.ok) throw new Error("Failed to load posts");

      const postData = (await postsResponse.json()) as PostsResponse;
      setRows(postData.posts || []);
      setSummary(postData.summary);
      setCategories(postData.categories || []);
      setCanPublish(Boolean(postData.permissions?.canPublish ?? true));

      if (analyticsResponse.ok) {
        const analyticsData = (await analyticsResponse.json()) as AnalyticsResponse;
        setAnalytics(analyticsData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load posts");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!getAdminToken()) {
      router.replace("/admin/login");
      return;
    }

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, search, category, status, workflow, archived]);

  const selectedCount = selectedIds.length;

  const selectedRows = useMemo(() => rows.filter((row) => selectedIds.includes(row._id)), [rows, selectedIds]);

  async function runBulk(action: "archive" | "publish" | "moveToReview" | "duplicate" | "delete") {
    if (selectedIds.length === 0) return;

    const response = await fetch(`${apiBase}/api/admin/posts/actions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAdminAuthHeaders(),
      },
      body: JSON.stringify({ action, ids: selectedIds }),
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => ({}))) as { message?: string };
      setError(payload.message || "Bulk action failed");
      return;
    }

    setSelectedIds([]);
    await load();
  }

  if (loading) {
    return <main className="p-6 md:p-10"><div className="rounded-lg border border-ivory-300 bg-white p-6">Loading posts...</div></main>;
  }

  return (
    <main className="p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-navy-800">Blog CMS</h1>
            <p className="text-sm text-charcoal-600 mt-1">Advanced editorial workspace with approvals, scheduling, analytics, and revisions.</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/admin/dashboard" className="rounded border border-charcoal-300 px-3 py-2 text-sm">Dashboard</Link>
            <Link href="/admin/posts/new" className="rounded bg-navy-700 px-4 py-2 text-white text-sm font-semibold">New Post</Link>
          </div>
        </div>

        {summary && (
          <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            <div className="rounded-lg border border-ivory-300 bg-white p-3"><p className="text-xs text-charcoal-500">Total</p><p className="text-xl font-bold">{summary.total}</p></div>
            <div className="rounded-lg border border-ivory-300 bg-white p-3"><p className="text-xs text-charcoal-500">Drafts</p><p className="text-xl font-bold">{summary.drafts}</p></div>
            <div className="rounded-lg border border-ivory-300 bg-white p-3"><p className="text-xs text-charcoal-500">Published</p><p className="text-xl font-bold">{summary.published}</p></div>
            <div className="rounded-lg border border-ivory-300 bg-white p-3"><p className="text-xs text-charcoal-500">Review</p><p className="text-xl font-bold">{summary.pendingApproval}</p></div>
            <div className="rounded-lg border border-ivory-300 bg-white p-3"><p className="text-xs text-charcoal-500">Scheduled</p><p className="text-xl font-bold">{summary.scheduled}</p></div>
            <div className="rounded-lg border border-ivory-300 bg-white p-3"><p className="text-xs text-charcoal-500">Archived</p><p className="text-xl font-bold">{summary.archived}</p></div>
            <div className="rounded-lg border border-ivory-300 bg-white p-3"><p className="text-xs text-charcoal-500">Featured</p><p className="text-xl font-bold">{summary.featured}</p></div>
          </section>
        )}

        {analytics && (
          <section className="rounded-lg border border-ivory-300 bg-white p-5">
            <h2 className="text-xl font-semibold text-navy-800 mb-4">Blog Analytics</h2>
            <div className="grid md:grid-cols-4 gap-4 mb-4">
              <div><p className="text-xs text-charcoal-500">Post views</p><p className="text-2xl font-bold">{analytics.totals.views}</p></div>
              <div><p className="text-xs text-charcoal-500">Likes</p><p className="text-2xl font-bold">{analytics.totals.likes}</p></div>
              <div><p className="text-xs text-charcoal-500">Comments</p><p className="text-2xl font-bold">{analytics.totals.comments}</p></div>
              <div><p className="text-xs text-charcoal-500">Engagement</p><p className="text-2xl font-bold">{analytics.engagementRate}%</p></div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-semibold mb-2">Popular posts</p>
                <div className="space-y-2">
                  {analytics.popularPosts.slice(0, 5).map((post) => (
                    <div key={post.id} className="rounded border border-ivory-300 p-2 text-sm">
                      <p className="font-medium line-clamp-1">{post.title}</p>
                      <p className="text-xs text-charcoal-500">{post.viewCount} views • {post.likeCount} likes • {post.commentCount} comments</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold mb-2">Referral sources</p>
                <div className="space-y-2">
                  {Object.entries(analytics.referralSources).map(([source, value]) => (
                    <div key={source} className="flex items-center justify-between rounded border border-ivory-300 p-2 text-sm">
                      <span className="capitalize">{source}</span>
                      <span className="font-semibold">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="rounded-lg border border-ivory-300 bg-white p-5 space-y-4">
          <div className="grid md:grid-cols-5 gap-3">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search title, slug, tag" className="md:col-span-2 rounded border border-charcoal-300 px-3 py-2 text-sm" />
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded border border-charcoal-300 px-3 py-2 text-sm">
              <option value="">All categories</option>
              {categories.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded border border-charcoal-300 px-3 py-2 text-sm">
              <option value="">All statuses</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
            <select value={workflow} onChange={(e) => setWorkflow(e.target.value)} className="rounded border border-charcoal-300 px-3 py-2 text-sm">
              <option value="">All workflows</option>
              <option value="draft">Draft</option>
              <option value="review">In review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button onClick={() => setArchived("active")} className={`rounded px-3 py-1.5 text-xs ${archived === "active" ? "bg-navy-700 text-white" : "border border-charcoal-300"}`}>Active</button>
            <button onClick={() => setArchived("archived")} className={`rounded px-3 py-1.5 text-xs ${archived === "archived" ? "bg-navy-700 text-white" : "border border-charcoal-300"}`}>Archived</button>
            <button onClick={() => setArchived("all")} className={`rounded px-3 py-1.5 text-xs ${archived === "all" ? "bg-navy-700 text-white" : "border border-charcoal-300"}`}>All</button>
          </div>

          {selectedCount > 0 && (
            <div className="rounded border border-ivory-300 bg-ivory-100 p-3 flex flex-wrap items-center gap-2">
              <span className="text-sm">{selectedCount} selected</span>
              <button onClick={() => runBulk("duplicate")} className="rounded border border-charcoal-300 px-2 py-1 text-xs">Duplicate</button>
              <button onClick={() => runBulk("archive")} className="rounded border border-charcoal-300 px-2 py-1 text-xs">Archive</button>
              <button onClick={() => runBulk("moveToReview")} className="rounded border border-charcoal-300 px-2 py-1 text-xs">Submit Review</button>
              <button onClick={() => runBulk("publish")} disabled={!canPublish} className="rounded border border-charcoal-300 px-2 py-1 text-xs disabled:opacity-40">Publish</button>
              <button onClick={() => runBulk("delete")} className="rounded border border-destructive/50 px-2 py-1 text-xs text-destructive">Delete</button>
            </div>
          )}

          <div className="overflow-auto">
            <table className="w-full min-w-[980px] text-sm">
              <thead>
                <tr className="border-b border-ivory-300 text-charcoal-600">
                  <th className="text-left py-2 pr-2"><input type="checkbox" checked={rows.length > 0 && selectedIds.length === rows.length} onChange={(e) => setSelectedIds(e.target.checked ? rows.map((row) => row._id) : [])} /></th>
                  <th className="text-left py-2 pr-2">Post</th>
                  <th className="text-left py-2 pr-2">Category</th>
                  <th className="text-left py-2 pr-2">Tags</th>
                  <th className="text-left py-2 pr-2">State</th>
                  <th className="text-left py-2 pr-2">Revisions</th>
                  <th className="text-left py-2 pr-2">Updated</th>
                  <th className="text-left py-2 pr-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((post) => {
                  const checked = selectedIds.includes(post._id);
                  return (
                    <tr key={post._id} className="border-b border-ivory-200 align-top">
                      <td className="py-3 pr-2"><input type="checkbox" checked={checked} onChange={(e) => setSelectedIds((current) => e.target.checked ? [...new Set([...current, post._id])] : current.filter((id) => id !== post._id))} /></td>
                      <td className="py-3 pr-2">
                        <p className="font-medium text-navy-800 line-clamp-1">{post.title}</p>
                        <p className="text-xs text-charcoal-500">/{post.slug}</p>
                      </td>
                      <td className="py-3 pr-2">{post.category}</td>
                      <td className="py-3 pr-2 text-xs text-charcoal-600">{(post.tags || []).slice(0, 3).join(", ")}</td>
                      <td className="py-3 pr-2"><span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusChip(post)}`}>{post.workflowStatus || post.status}</span></td>
                      <td className="py-3 pr-2">{post.revisionCount || 0}</td>
                      <td className="py-3 pr-2 text-xs text-charcoal-500">{new Date(post.updatedAt).toLocaleString()}</td>
                      <td className="py-3 pr-2">
                        <div className="flex items-center gap-2">
                          <Link href={`/admin/posts/edit/${post._id}`} className="rounded border border-charcoal-300 px-2 py-1 text-xs">Edit</Link>
                          <button onClick={async () => {
                            const response = await fetch(`${apiBase}/api/admin/posts/actions`, {
                              method: "POST",
                              headers: { "Content-Type": "application/json", ...getAdminAuthHeaders() },
                              body: JSON.stringify({ action: "duplicate", ids: [post._id] }),
                            });
                            if (response.ok) load();
                          }} className="rounded border border-charcoal-300 px-2 py-1 text-xs">Duplicate</button>
                          <button onClick={async () => {
                            const response = await fetch(`${apiBase}/api/admin/posts/actions`, {
                              method: "POST",
                              headers: { "Content-Type": "application/json", ...getAdminAuthHeaders() },
                              body: JSON.stringify({ action: "archive", ids: [post._id] }),
                            });
                            if (response.ok) load();
                          }} className="rounded border border-charcoal-300 px-2 py-1 text-xs">Archive</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {selectedRows.length > 0 && (
            <p className="text-xs text-charcoal-500">Selected: {selectedRows.map((item) => item.title).join("; ")}</p>
          )}
        </section>

        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    </main>
  );
}
