"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAdminToken } from "@/lib/adminAuth";

const sections = [
  {
    title: "Access And Roles",
    items: [
      "Login route: /admin/login",
      "Admin routes: /admin/dashboard, /admin/posts, /admin/messages, /admin/subscribers",
      "admin role: full create/edit/publish/archive/delete permissions",
      "editor role: create/edit/submit for review, cannot publish directly",
    ],
  },
  {
    title: "Publishing Workflow",
    items: [
      "Create post from /admin/posts/new",
      "Required basics: title, slug, content",
      "Set featured image and provide alt text",
      "Complete SEO fields (meta, OG, Twitter)",
      "Editors submit as review; admins can publish",
      "Verify public page at /news/{slug}",
    ],
  },
  {
    title: "Post Editor Features",
    items: [
      "HTML and Markdown modes",
      "Toolbar snippets: bold, italic, code block, links",
      "Drag-and-drop image embedding in content",
      "Autosave every 12 seconds in edit mode",
      "Revision history restore for rollback",
    ],
  },
  {
    title: "Bulk CMS Operations",
    items: [
      "From /admin/posts select multiple rows",
      "Actions: Duplicate, Archive, Submit Review, Publish, Delete",
      "Use status/workflow filters to process queues quickly",
    ],
  },
  {
    title: "Messages And Subscribers",
    items: [
      "Messages: mark new/responded and record notes",
      "SMTP test button validates outbound contact notification pipeline",
      "Subscribers: filter/search/copy emails/export CSV",
      "Subscriber page stores display preferences locally",
    ],
  },
  {
    title: "Troubleshooting",
    items: [
      "Login loop/401: sign in again, check JWT_SECRET consistency",
      "Cannot publish: verify user role is admin",
      "Image save issue: provide alt text and valid image input",
      "CSV export issue: verify auth token and newsletter export endpoint",
      "API banner red: verify API process, DB connectivity, and env vars",
    ],
  },
];

export default function AdminGuidePage() {
  const router = useRouter();

  useEffect(() => {
    if (!getAdminToken()) {
      router.replace("/admin/login");
    }
  }, [router]);

  return (
    <main className="p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-navy-800">Admin User Guide</h1>
            <p className="text-sm text-charcoal-600 mt-1">Reference page for operating the CMS and navigating key admin workflows.</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/admin/dashboard" className="rounded border border-charcoal-300 px-3 py-2 text-sm">Dashboard</Link>
            <Link href="/admin/posts" className="rounded border border-charcoal-300 px-3 py-2 text-sm">Posts</Link>
          </div>
        </div>

        <section className="rounded-lg border border-ivory-300 bg-white p-5">
          <h2 className="text-xl font-semibold text-navy-800 mb-3">Quick Actions</h2>
          <div className="grid sm:grid-cols-2 gap-2 text-sm">
            <Link href="/admin/posts/new" className="rounded border border-charcoal-300 px-3 py-2">Create New Post</Link>
            <Link href="/admin/posts" className="rounded border border-charcoal-300 px-3 py-2">Open Blog CMS</Link>
            <Link href="/admin/messages" className="rounded border border-charcoal-300 px-3 py-2">Open Contact Messages</Link>
            <Link href="/admin/subscribers" className="rounded border border-charcoal-300 px-3 py-2">Open Subscribers</Link>
          </div>
        </section>

        {sections.map((section) => (
          <section key={section.title} className="rounded-lg border border-ivory-300 bg-white p-5">
            <h2 className="text-xl font-semibold text-navy-800 mb-3">{section.title}</h2>
            <ul className="space-y-2 text-sm text-charcoal-700 list-disc pl-5">
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
