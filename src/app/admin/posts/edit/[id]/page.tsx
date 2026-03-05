"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PostEditorForm from "@/components/admin/PostEditorForm";
import { getAdminAuthHeaders, getAdminToken } from "@/lib/adminAuth";
import { CmsPost, getCmsApiBaseUrl } from "@/lib/cms";

interface CmsRevision {
  _id: string;
  createdAt: string;
  revisionNote?: string;
}

export default function AdminEditPostPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [post, setPost] = useState<CmsPost | null>(null);
  const [revisions, setRevisions] = useState<CmsRevision[]>([]);
  const [canPublish, setCanPublish] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!getAdminToken()) {
      router.replace("/admin/login");
      return;
    }

    async function load() {
      try {
        const response = await fetch(`${getCmsApiBaseUrl()}/api/admin/posts/${params.id}`, {
          headers: {
            ...getAdminAuthHeaders(),
          },
        });

        if (!response.ok) {
          throw new Error("Post not found");
        }

        const data = (await response.json()) as { post: CmsPost; revisions?: CmsRevision[]; permissions?: { canPublish?: boolean } };
        setPost(data.post);
        setRevisions(data.revisions || []);
        setCanPublish(Boolean(data.permissions?.canPublish ?? true));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load post");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [params.id, router]);

  return (
    <main className="p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-navy-800 mb-6">Edit Post</h1>

        {loading ? (
          <div className="rounded-lg border border-ivory-300 bg-white p-6">Loading post...</div>
        ) : error ? (
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-6 text-destructive">{error}</div>
        ) : post ? (
          <PostEditorForm mode="edit" initialPost={post} initialRevisions={revisions} canPublish={canPublish} />
        ) : null}
      </div>
    </main>
  );
}
