"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getAdminAuthHeaders } from "@/lib/adminAuth";
import { CmsPost, getCmsApiBaseUrl } from "@/lib/cms";

interface PostEditorFormProps {
  mode: "create" | "edit";
  initialPost?: CmsPost;
  initialRevisions?: Array<{ _id: string; createdAt: string; revisionNote?: string }>;
  canPublish?: boolean;
}

interface AuthorItem {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor";
}

interface MediaItem {
  id: string;
  postTitle: string;
  url: string;
  alt: string;
}

function nowLocalDateTime() {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
}

function simpleMarkdownToHtml(value: string) {
  return value
    .replace(/^###\s+(.*)$/gm, "<h3>$1</h3>")
    .replace(/^##\s+(.*)$/gm, "<h2>$1</h2>")
    .replace(/^#\s+(.*)$/gm, "<h1>$1</h1>")
    .replace(/```([\s\S]*?)```/g, (_match, code) => `<pre><code>${code.trim()}</code></pre>`)
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\[(.*?)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/\n\n+/g, "</p><p>")
    .replace(/^/, "<p>")
    .replace(/$/, "</p>");
}

export default function PostEditorForm({ mode, initialPost, initialRevisions = [], canPublish = true }: PostEditorFormProps) {
  const router = useRouter();
  const contentRef = useRef<HTMLTextAreaElement | null>(null);
  const markdownRef = useRef<HTMLTextAreaElement | null>(null);

  const [title, setTitle] = useState(initialPost?.title ?? "");
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt ?? "");
  const [subheading, setSubheading] = useState(initialPost?.subheading ?? "");
  const [slug, setSlug] = useState(initialPost?.slug ?? "");
  const [category, setCategory] = useState(initialPost?.category ?? "General");
  const [tags, setTags] = useState((initialPost?.tags || []).join(", "));
  const [relatedPostIds, setRelatedPostIds] = useState<string[]>((initialPost?.relatedPostIds || []).slice(0, 12));

  const [contentFormat, setContentFormat] = useState<"html" | "markdown">(initialPost?.contentFormat || "html");
  const [content, setContent] = useState(initialPost?.content ?? "");
  const [markdownContent, setMarkdownContent] = useState(initialPost?.markdownContent ?? "");

  const [metaTitle, setMetaTitle] = useState(initialPost?.metaTitle ?? "");
  const [metaDescription, setMetaDescription] = useState(initialPost?.metaDescription ?? "");
  const [canonicalUrl, setCanonicalUrl] = useState(initialPost?.canonicalUrl ?? "");
  const [ogTitle, setOgTitle] = useState(initialPost?.ogTitle ?? "");
  const [ogDescription, setOgDescription] = useState(initialPost?.ogDescription ?? "");
  const [ogImage, setOgImage] = useState(initialPost?.ogImage ?? "");
  const [twitterTitle, setTwitterTitle] = useState(initialPost?.twitterTitle ?? "");
  const [twitterDescription, setTwitterDescription] = useState(initialPost?.twitterDescription ?? "");
  const [twitterImage, setTwitterImage] = useState(initialPost?.twitterImage ?? "");
  const [twitterCard, setTwitterCard] = useState(initialPost?.twitterCard ?? "summary_large_image");

  const [status, setStatus] = useState<"draft" | "published">(initialPost?.status ?? "draft");
  const [workflowStatus, setWorkflowStatus] = useState<"draft" | "review" | "approved" | "rejected" | "published" | "archived">(
    initialPost?.workflowStatus ?? "draft"
  );
  const [publishDate, setPublishDate] = useState(initialPost?.publishDate?.slice(0, 16) ?? "");
  const [scheduledFor, setScheduledFor] = useState(initialPost?.scheduledFor?.slice(0, 16) ?? "");
  const [approvalNotes, setApprovalNotes] = useState(initialPost?.approvalNotes ?? "");
  const [assignedAuthorId, setAssignedAuthorId] = useState(initialPost?.assignedAuthorId ?? "");
  const [isFeatured, setIsFeatured] = useState(Boolean(initialPost?.isFeatured));

  const [featuredImageAlt, setFeaturedImageAlt] = useState(initialPost?.featuredImage?.alt ?? "");
  const [featuredImageUrl, setFeaturedImageUrl] = useState(initialPost?.featuredImage?.url ?? "");
  const [featuredImageFile, setFeaturedImageFile] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);

  const [shareFacebook, setShareFacebook] = useState(Boolean(initialPost?.socialChannels?.facebook));
  const [shareInstagram, setShareInstagram] = useState(Boolean(initialPost?.socialChannels?.instagram));
  const [shareLinkedIn, setShareLinkedIn] = useState(Boolean(initialPost?.socialChannels?.linkedin));
  const [shareTwitter, setShareTwitter] = useState(Boolean(initialPost?.socialChannels?.twitter));

  const [allPosts, setAllPosts] = useState<CmsPost[]>([]);
  const [authors, setAuthors] = useState<AuthorItem[]>([]);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [revisions, setRevisions] = useState(initialRevisions);

  const [saving, setSaving] = useState(false);
  const [autosaveStatus, setAutosaveStatus] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const apiBase = useMemo(() => getCmsApiBaseUrl(), []);

  useEffect(() => {
    const normalized = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    if (!initialPost && !slug) {
      setSlug(normalized);
    }
  }, [initialPost, slug, title]);

  useEffect(() => {
    let active = true;
    async function loadSupportData() {
      try {
        const [postsResponse, mediaResponse] = await Promise.all([
          fetch(`${apiBase}/api/admin/posts`, { headers: { ...getAdminAuthHeaders() } }),
          fetch(`${apiBase}/api/admin/media`, { headers: { ...getAdminAuthHeaders() } }),
        ]);

        if (!active) return;

        if (postsResponse.ok) {
          const data = (await postsResponse.json()) as { posts?: CmsPost[]; authors?: AuthorItem[] };
          setAllPosts(data.posts || []);
          setAuthors(data.authors || []);
        }

        if (mediaResponse.ok) {
          const mediaData = (await mediaResponse.json()) as { items?: MediaItem[] };
          setMediaItems(mediaData.items || []);
        }
      } catch {
        // Non-blocking helper data.
      }
    }

    loadSupportData();
    return () => {
      active = false;
    };
  }, [apiBase]);

  useEffect(() => {
    if (mode !== "edit" || !initialPost?._id) return;

    const timer = window.setInterval(async () => {
      try {
        const formData = new FormData();
        formData.set("title", title);
        formData.set("subheading", subheading);
        formData.set("excerpt", excerpt);
        formData.set("contentFormat", contentFormat);
        formData.set("content", content);
        formData.set("markdownContent", markdownContent);

        const response = await fetch(`${apiBase}/api/admin/posts/${initialPost._id}?action=autosave`, {
          method: "PUT",
          headers: {
            ...getAdminAuthHeaders(),
          },
          body: formData,
        });

        if (response.ok) {
          setAutosaveStatus(`Autosaved ${new Date().toLocaleTimeString()}`);
        }
      } catch {
        setAutosaveStatus("Autosave failed");
      }
    }, 12000);

    return () => {
      window.clearInterval(timer);
    };
  }, [apiBase, content, contentFormat, excerpt, initialPost?._id, markdownContent, mode, subheading, title]);

  const previewHtml = useMemo(() => {
    if (contentFormat === "markdown") {
      return simpleMarkdownToHtml(markdownContent || "");
    }
    return content || "<p>No preview content</p>";
  }, [content, contentFormat, markdownContent]);

  function insertAtCursor(value: string) {
    const target = contentFormat === "markdown" ? markdownRef.current : contentRef.current;
    if (!target) return;

    const start = target.selectionStart || 0;
    const end = target.selectionEnd || 0;
    const current = contentFormat === "markdown" ? markdownContent : content;
    const next = `${current.slice(0, start)}${value}${current.slice(end)}`;

    if (contentFormat === "markdown") {
      setMarkdownContent(next);
    } else {
      setContent(next);
    }

    requestAnimationFrame(() => {
      target.focus();
      target.selectionStart = start + value.length;
      target.selectionEnd = start + value.length;
    });
  }

  function onDropImage(event: React.DragEvent<HTMLTextAreaElement>) {
    const file = event.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    event.preventDefault();
    setFeaturedImageFile(file);

    const blobUrl = URL.createObjectURL(file);
    const embed = contentFormat === "markdown"
      ? `\n\n![${featuredImageAlt || title || "image"}](${blobUrl})\n\n`
      : `\n<p><img src=\"${blobUrl}\" alt=\"${featuredImageAlt || title || "image"}\" loading=\"lazy\" /></p>\n`;

    insertAtCursor(embed);
  }

  async function onRestoreRevision(revisionId: string) {
    if (!initialPost?._id) return;
    if (!confirm("Restore this revision? Current draft will be snapshotted.")) return;

    const formData = new FormData();
    formData.set("revisionId", revisionId);

    const response = await fetch(`${apiBase}/api/admin/posts/${initialPost._id}?action=restore`, {
      method: "PUT",
      headers: { ...getAdminAuthHeaders() },
      body: formData,
    });

    const payload = (await response.json().catch(() => ({}))) as { post?: CmsPost; message?: string };
    if (!response.ok || !payload.post) {
      setError(payload.message || "Failed to restore revision");
      return;
    }

    router.refresh();
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.set("title", title);
      formData.set("excerpt", excerpt);
      formData.set("subheading", subheading);
      formData.set("slug", slug);
      formData.set("category", category);
      formData.set("tags", tags);
      formData.set("contentFormat", contentFormat);
      formData.set("content", content);
      formData.set("markdownContent", markdownContent);
      formData.set("metaTitle", metaTitle);
      formData.set("metaDescription", metaDescription);
      formData.set("canonicalUrl", canonicalUrl);
      formData.set("ogTitle", ogTitle);
      formData.set("ogDescription", ogDescription);
      formData.set("ogImage", ogImage);
      formData.set("twitterTitle", twitterTitle);
      formData.set("twitterDescription", twitterDescription);
      formData.set("twitterImage", twitterImage);
      formData.set("twitterCard", twitterCard);
      formData.set("status", canPublish ? status : "draft");
      formData.set("workflowStatus", workflowStatus);
      formData.set("publishDate", publishDate ? new Date(publishDate).toISOString() : "");
      formData.set("scheduledFor", scheduledFor ? new Date(scheduledFor).toISOString() : "");
      formData.set("approvalNotes", approvalNotes);
      formData.set("featuredImageAlt", featuredImageAlt);
      formData.set("featuredImageUrl", featuredImageUrl);
      formData.set("removeFeaturedImage", String(removeImage));
      formData.set("facebook", String(shareFacebook));
      formData.set("instagram", String(shareInstagram));
      formData.set("linkedin", String(shareLinkedIn));
      formData.set("twitter", String(shareTwitter));
      formData.set("isFeatured", String(isFeatured));
      formData.set("relatedPostIds", relatedPostIds.join(","));
      formData.set("assignedAuthorId", assignedAuthorId);
      formData.set("revisionNote", "Manual save from editor");

      if (featuredImageFile) {
        formData.set("featuredImage", featuredImageFile);
      }

      const isEdit = mode === "edit" && initialPost?._id;
      const url = isEdit ? `${apiBase}/api/admin/posts/${initialPost._id}` : `${apiBase}/api/admin/posts`;

      const response = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          ...getAdminAuthHeaders(),
        },
        body: formData,
      });

      const payload = (await response.json().catch(() => ({}))) as { errors?: string[]; message?: string };

      if (!response.ok) {
        const message = payload?.errors?.join(", ") || payload?.message || "Failed to save post";
        throw new Error(message);
      }

      router.push("/admin/posts");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save post");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <section className="rounded-lg border border-ivory-300 bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="text-xl font-semibold text-navy-800">Content Workspace</h2>
          <div className="text-xs text-charcoal-500">{autosaveStatus || "Autosave every 12s in edit mode"}</div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-md border border-charcoal-300 px-3 py-2" required />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Excerpt</label>
            <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} className="w-full rounded-md border border-charcoal-300 px-3 py-2" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Subheading</label>
            <input value={subheading} onChange={(e) => setSubheading(e.target.value)} className="w-full rounded-md border border-charcoal-300 px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Slug</label>
            <input value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full rounded-md border border-charcoal-300 px-3 py-2" required />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Canonical URL</label>
            <input value={canonicalUrl} onChange={(e) => setCanonicalUrl(e.target.value)} placeholder="https://example.com/news/post" className="w-full rounded-md border border-charcoal-300 px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <input value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-md border border-charcoal-300 px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
            <input value={tags} onChange={(e) => setTags(e.target.value)} className="w-full rounded-md border border-charcoal-300 px-3 py-2" placeholder="marketplace, ecommerce, growth" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Format</label>
            <select value={contentFormat} onChange={(e) => setContentFormat(e.target.value as "html" | "markdown")} className="w-full rounded-md border border-charcoal-300 px-3 py-2">
              <option value="html">Rich Text (HTML)</option>
              <option value="markdown">Markdown</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as "draft" | "published")} className="w-full rounded-md border border-charcoal-300 px-3 py-2" disabled={!canPublish}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
            {!canPublish && <p className="mt-1 text-xs text-amber-700">Editors can submit for approval but cannot publish directly.</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Workflow</label>
            <select value={workflowStatus} onChange={(e) => setWorkflowStatus(e.target.value as typeof workflowStatus)} className="w-full rounded-md border border-charcoal-300 px-3 py-2">
              <option value="draft">Draft</option>
              <option value="review">In Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Publish Date</label>
            <input type="datetime-local" value={publishDate} onChange={(e) => setPublishDate(e.target.value)} className="w-full rounded-md border border-charcoal-300 px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Schedule Publish</label>
            <input type="datetime-local" value={scheduledFor} onChange={(e) => setScheduledFor(e.target.value)} className="w-full rounded-md border border-charcoal-300 px-3 py-2" min={nowLocalDateTime()} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Assign Author</label>
            <select value={assignedAuthorId} onChange={(e) => setAssignedAuthorId(e.target.value)} className="w-full rounded-md border border-charcoal-300 px-3 py-2">
              <option value="">Unassigned</option>
              {authors.map((author) => (
                <option key={author.id} value={author.id}>{author.name} ({author.role})</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
              <span className="text-sm font-medium">Featured post</span>
            </label>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Related posts</label>
            <div className="max-h-44 overflow-auto rounded-md border border-charcoal-300 p-3">
              <div className="grid gap-2 sm:grid-cols-2">
                {allPosts
                  .filter((item) => item._id !== initialPost?._id)
                  .slice(0, 40)
                  .map((item) => {
                    const checked = relatedPostIds.includes(item._id);
                    return (
                      <label key={item._id} className="inline-flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(event) => {
                            if (event.target.checked) {
                              setRelatedPostIds((current) => [...new Set([...current, item._id])].slice(0, 12));
                            } else {
                              setRelatedPostIds((current) => current.filter((id) => id !== item._id));
                            }
                          }}
                        />
                        <span className="line-clamp-1">{item.title}</span>
                      </label>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-ivory-300 bg-white p-6">
        <h2 className="text-xl font-semibold text-navy-800 mb-4">Editor</h2>

        <div className="flex flex-wrap gap-2 mb-3">
          <button type="button" onClick={() => insertAtCursor(contentFormat === "markdown" ? "**bold**" : "<strong>bold</strong>")} className="rounded border px-2 py-1 text-xs">Bold</button>
          <button type="button" onClick={() => insertAtCursor(contentFormat === "markdown" ? "*italic*" : "<em>italic</em>")} className="rounded border px-2 py-1 text-xs">Italic</button>
          <button type="button" onClick={() => insertAtCursor(contentFormat === "markdown" ? "\n\n```\ncode\n```\n\n" : "<pre><code>code</code></pre>")} className="rounded border px-2 py-1 text-xs">Code block</button>
          <button type="button" onClick={() => {
            const url = prompt("Enter URL");
            if (!url) return;
            insertAtCursor(contentFormat === "markdown" ? `[link text](${url})` : `<a href=\"${url}\" target=\"_blank\" rel=\"noopener noreferrer\">link text</a>`);
          }} className="rounded border px-2 py-1 text-xs">Link</button>
          <button type="button" onClick={() => {
            const url = prompt("Enter link to preview");
            if (!url) return;
            const host = (() => { try { return new URL(url).hostname; } catch { return url; } })();
            insertAtCursor(contentFormat === "markdown"
              ? `\n\n> Link Preview: [${host}](${url})\n\n`
              : `<div class=\"link-preview\"><a href=\"${url}\" target=\"_blank\" rel=\"noopener noreferrer\">${host}</a></div>`);
          }} className="rounded border px-2 py-1 text-xs">Link preview</button>
        </div>

        {contentFormat === "markdown" ? (
          <textarea
            ref={markdownRef}
            value={markdownContent}
            onChange={(e) => setMarkdownContent(e.target.value)}
            onDrop={onDropImage}
            onDragOver={(e) => e.preventDefault()}
            rows={16}
            className="w-full rounded-md border border-charcoal-300 px-3 py-2 font-mono text-sm"
            required
          />
        ) : (
          <textarea
            ref={contentRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onDrop={onDropImage}
            onDragOver={(e) => e.preventDefault()}
            rows={16}
            className="w-full rounded-md border border-charcoal-300 px-3 py-2 font-mono text-sm"
            required
          />
        )}

        <p className="mt-2 text-xs text-charcoal-500">Supports drag-and-drop media embed, code blocks, markdown, and HTML content.</p>
      </section>

      <section className="rounded-lg border border-ivory-300 bg-white p-6">
        <h2 className="text-xl font-semibold text-navy-800 mb-4">Media Management</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-2">Upload / replace featured image</label>
            <input type="file" accept="image/png,image/jpeg,image/webp,image/avif" onChange={(e) => setFeaturedImageFile(e.target.files?.[0] ?? null)} className="w-full rounded-md border border-charcoal-300 px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Or paste image URL (CDN ready)</label>
            <input value={featuredImageUrl} onChange={(e) => setFeaturedImageUrl(e.target.value)} className="w-full rounded-md border border-charcoal-300 px-3 py-2" placeholder="https://cdn.example.com/image.webp" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Image alt text</label>
            <input value={featuredImageAlt} onChange={(e) => setFeaturedImageAlt(e.target.value)} className="w-full rounded-md border border-charcoal-300 px-3 py-2" placeholder="Describe the image for accessibility" />
          </div>
        </div>

        <div className="mt-4 rounded-md border border-ivory-300 p-3">
          <p className="text-sm font-medium mb-2">Image library</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-52 overflow-auto">
            {mediaItems.slice(0, 24).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (!item.url) return;
                  setFeaturedImageUrl(item.url);
                  setFeaturedImageAlt(item.alt || featuredImageAlt);
                }}
                className="text-left rounded border border-ivory-300 p-2 hover:border-navy-400"
              >
                <div className="aspect-[4/3] bg-ivory-100 overflow-hidden rounded mb-2">
                  {item.url ? <img src={item.url} alt={item.alt || item.postTitle} className="h-full w-full object-cover" loading="lazy" /> : null}
                </div>
                <p className="text-xs line-clamp-2">{item.postTitle}</p>
              </button>
            ))}
          </div>
        </div>

        {initialPost?.featuredImage?.url && (
          <div className="mt-4 flex items-center gap-3">
            <img src={initialPost.featuredImage.url} alt={initialPost.featuredImage.alt || initialPost.title} className="h-20 w-28 object-cover rounded border border-ivory-300" loading="lazy" />
            <button type="button" onClick={() => setRemoveImage((prev) => !prev)} className={`rounded-md px-3 py-1.5 text-sm ${removeImage ? "bg-destructive text-white" : "border border-charcoal-300"}`}>
              {removeImage ? "Image will be removed" : "Delete current image"}
            </button>
          </div>
        )}
      </section>

      <section className="rounded-lg border border-ivory-300 bg-white p-6">
        <h2 className="text-xl font-semibold text-navy-800 mb-4">SEO + OpenGraph + Twitter</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-2">SEO title</label>
            <input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} className="w-full rounded-md border border-charcoal-300 px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Twitter card</label>
            <select value={twitterCard} onChange={(e) => setTwitterCard(e.target.value)} className="w-full rounded-md border border-charcoal-300 px-3 py-2">
              <option value="summary">summary</option>
              <option value="summary_large_image">summary_large_image</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Meta description</label>
            <textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} rows={3} className="w-full rounded-md border border-charcoal-300 px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">OG title</label>
            <input value={ogTitle} onChange={(e) => setOgTitle(e.target.value)} className="w-full rounded-md border border-charcoal-300 px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">OG image URL</label>
            <input value={ogImage} onChange={(e) => setOgImage(e.target.value)} className="w-full rounded-md border border-charcoal-300 px-3 py-2" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">OG description</label>
            <textarea value={ogDescription} onChange={(e) => setOgDescription(e.target.value)} rows={2} className="w-full rounded-md border border-charcoal-300 px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Twitter title</label>
            <input value={twitterTitle} onChange={(e) => setTwitterTitle(e.target.value)} className="w-full rounded-md border border-charcoal-300 px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Twitter image URL</label>
            <input value={twitterImage} onChange={(e) => setTwitterImage(e.target.value)} className="w-full rounded-md border border-charcoal-300 px-3 py-2" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Twitter description</label>
            <textarea value={twitterDescription} onChange={(e) => setTwitterDescription(e.target.value)} rows={2} className="w-full rounded-md border border-charcoal-300 px-3 py-2" />
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-ivory-300 bg-white p-6">
        <h2 className="text-xl font-semibold text-navy-800 mb-4">Social + Editorial Workflow</h2>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-4">
          <label className="inline-flex items-center gap-2 rounded-md border border-ivory-300 px-3 py-2">
            <input type="checkbox" checked={shareFacebook} onChange={(event) => setShareFacebook(event.target.checked)} />
            <span className="text-sm font-medium">Facebook</span>
          </label>
          <label className="inline-flex items-center gap-2 rounded-md border border-ivory-300 px-3 py-2">
            <input type="checkbox" checked={shareInstagram} onChange={(event) => setShareInstagram(event.target.checked)} />
            <span className="text-sm font-medium">Instagram</span>
          </label>
          <label className="inline-flex items-center gap-2 rounded-md border border-ivory-300 px-3 py-2">
            <input type="checkbox" checked={shareLinkedIn} onChange={(event) => setShareLinkedIn(event.target.checked)} />
            <span className="text-sm font-medium">LinkedIn</span>
          </label>
          <label className="inline-flex items-center gap-2 rounded-md border border-ivory-300 px-3 py-2">
            <input type="checkbox" checked={shareTwitter} onChange={(event) => setShareTwitter(event.target.checked)} />
            <span className="text-sm font-medium">Twitter / X</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Approval notes</label>
          <textarea value={approvalNotes} onChange={(e) => setApprovalNotes(e.target.value)} rows={2} className="w-full rounded-md border border-charcoal-300 px-3 py-2" placeholder="Editorial notes, review feedback, publication guidance" />
        </div>
      </section>

      {mode === "edit" && revisions.length > 0 && (
        <section className="rounded-lg border border-ivory-300 bg-white p-6">
          <h2 className="text-xl font-semibold text-navy-800 mb-4">Version History</h2>
          <div className="space-y-2 max-h-56 overflow-auto">
            {revisions.map((revision) => (
              <div key={revision._id} className="flex items-center justify-between rounded border border-ivory-300 p-3">
                <div>
                  <p className="text-sm font-medium">{new Date(revision.createdAt).toLocaleString()}</p>
                  <p className="text-xs text-charcoal-500">{revision.revisionNote || "Snapshot"}</p>
                </div>
                <button type="button" onClick={() => onRestoreRevision(revision._id)} className="rounded border border-charcoal-300 px-3 py-1 text-xs">Restore</button>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="rounded-lg border border-ivory-300 bg-white p-6">
        <h2 className="text-xl font-semibold text-navy-800 mb-4">Preview before publish</h2>
        <div className="group bg-white rounded-lg overflow-hidden shadow-lg border border-ivory-300">
          <div className="relative h-64 overflow-hidden bg-ivory-100">
            {featuredImageFile ? (
              <img src={URL.createObjectURL(featuredImageFile)} alt={featuredImageAlt || title || "Preview image"} className="w-full h-full object-cover" loading="lazy" />
            ) : featuredImageUrl && !removeImage ? (
              <img src={featuredImageUrl} alt={featuredImageAlt || title} className="w-full h-full object-cover" loading="lazy" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-navy-900 to-charcoal-900" />
            )}
          </div>
          <div className="p-6">
            <h3 className="font-playfair text-2xl font-bold text-navy-800 mb-2">{title || "Post title"}</h3>
            <p className="font-inter text-charcoal-600 mb-4">{subheading || "Subheading preview"}</p>
            <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: previewHtml }} />
          </div>
        </div>
      </section>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="rounded-md bg-navy-700 hover:bg-navy-800 text-white px-5 py-2 font-semibold disabled:opacity-60">
          {saving ? "Saving..." : mode === "create" ? "Create Post" : "Update Post"}
        </button>
        <button type="button" onClick={() => router.push("/admin/posts")} className="rounded-md border border-charcoal-300 px-5 py-2">Cancel</button>
      </div>
    </form>
  );
}
