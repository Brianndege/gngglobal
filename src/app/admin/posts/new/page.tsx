"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import PostEditorForm from "@/components/admin/PostEditorForm";
import { getAdminToken } from "@/lib/adminAuth";

export default function AdminNewPostPage() {
  const router = useRouter();

  useEffect(() => {
    if (!getAdminToken()) {
      router.replace("/admin/login");
    }
  }, [router]);

  return (
    <main className="p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-navy-800 mb-6">Create New Post</h1>
        <PostEditorForm mode="create" />
      </div>
    </main>
  );
}
