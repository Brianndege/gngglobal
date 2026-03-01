"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clearAdminToken, getAdminAuthHeaders, getAdminToken } from "@/lib/adminAuth";
import { CmsPost, getCmsApiBaseUrl } from "@/lib/cms";

function socialLabels(post: CmsPost) {
  const labels: string[] = [];
  if (post.socialChannels?.facebook) labels.push("Facebook");
  if (post.socialChannels?.instagram) labels.push("Instagram");
  if (post.socialChannels?.linkedin) labels.push("LinkedIn");
  if (post.socialChannels?.twitter) labels.push("Twitter/X");
  return labels;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<CmsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!getAdminToken()) {
      router.replace("/admin/login");
      return;
    }

    async function load() {
      try {
        const response = await fetch(`${getCmsApiBaseUrl()}/api/admin/posts`, {
          headers: {
            ...getAdminAuthHeaders(),
          },
        });

        if (response.status === 401) {
          clearAdminToken();
          router.replace("/admin/login");
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to load posts");
        }

        const data = (await response.json()) as { posts: CmsPost[] };
        setPosts(data.posts);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load posts");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [router]);

  async function onDelete(id: string) {
    if (!confirm("Delete this post?")) return;

    const response = await fetch(`${getCmsApiBaseUrl()}/api/admin/posts/${id}`, {
      method: "DELETE",
      headers: {
        ...getAdminAuthHeaders(),
      },
    });

    if (response.ok) {
      setPosts((prev) => prev.filter((post) => post._id !== id));
    }
  }

  return (
    <main className="p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold text-navy-800">Admin Dashboard</h1>
          <div className="flex items-center gap-3">
            <Link href="/admin/messages" className="rounded-md border border-charcoal-300 px-4 py-2 text-charcoal-700">Messages</Link>
            <Link href="/admin/subscribers" className="rounded-md border border-charcoal-300 px-4 py-2 text-charcoal-700">Subscribers</Link>
            <Link href="/admin/posts/new" className="rounded-md bg-navy-700 hover:bg-navy-800 text-white px-4 py-2 font-semibold">Add New Post</Link>
            <button
              onClick={() => {
                clearAdminToken();
                router.push("/admin/login");
              }}
              className="rounded-md border border-charcoal-300 px-4 py-2 text-charcoal-700"
            >
              Logout
            </button>
          </div>
        </div>

        {loading ? (
          <div className="rounded-lg bg-white p-6 border border-ivory-300">Loading posts...</div>
        ) : error ? (
          <div className="rounded-lg bg-destructive/5 border border-destructive/20 text-destructive p-6">{error}</div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-ivory-300 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-ivory-100">
                <tr>
                  <th className="text-left p-4">Title</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Social</th>
                  <th className="text-left p-4">Updated</th>
                  <th className="text-right p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => {
                  const channels = socialLabels(post);

                  return (
                  <tr key={post._id} className="border-t border-ivory-200">
                    <td className="p-4">{post.title}</td>
                    <td className="p-4">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${post.status === "published" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="p-4">
                      {channels.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {channels.map((channel) => (
                            <span
                              key={channel}
                              className="inline-flex rounded-full bg-navy-100 text-navy-800 px-2.5 py-1 text-xs font-semibold"
                            >
                              {channel}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-charcoal-500">—</span>
                      )}
                    </td>
                    <td className="p-4">{new Date(post.updatedAt).toLocaleDateString("en-AU")}</td>
                    <td className="p-4 text-right space-x-2">
                      <Link href={`/admin/posts/edit/${post._id}`} className="rounded-md border border-charcoal-300 px-3 py-1.5">Edit</Link>
                      <button onClick={() => onDelete(post._id)} className="rounded-md bg-destructive text-white px-3 py-1.5">Delete</button>
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
