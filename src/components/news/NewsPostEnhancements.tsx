"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Heart, MessageCircle, Share2, ThumbsUp } from "lucide-react";
import { CmsPost, getCmsApiBaseUrl } from "@/lib/cms";
import { extractHeadings, getPostImageUrl, getReadingTimeMinutes, withHeadingAnchors } from "@/lib/blog";
import NewsletterSignup from "@/components/news/NewsletterSignup";

interface NewsPostEnhancementsProps {
  post: CmsPost;
  relatedPosts: CmsPost[];
  recommendedPosts: CmsPost[];
}

interface LocalComment {
  id: string;
  name: string;
  text: string;
  createdAt: string;
}

function formatDate(value?: string) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function NewsPostEnhancements({ post, relatedPosts, recommendedPosts }: NewsPostEnhancementsProps) {
  const [progress, setProgress] = useState(0);
  const [likes, setLikes] = useState(0);
  const [claps, setClaps] = useState(0);
  const [comments, setComments] = useState<LocalComment[]>([]);
  const [name, setName] = useState("");
  const [commentText, setCommentText] = useState("");

  const cmsBase = useMemo(() => getCmsApiBaseUrl(), []);
  const headings = useMemo(() => extractHeadings(post.content), [post.content]);
  const htmlWithAnchors = useMemo(() => withHeadingAnchors(post.content), [post.content]);
  const readingTime = useMemo(() => getReadingTimeMinutes(post.content), [post.content]);

  useEffect(() => {
    const commentsKey = `news-comments:${post.slug}`;
    const likesKey = `news-likes:${post.slug}`;
    const clapsKey = `news-claps:${post.slug}`;

    const savedComments = window.localStorage.getItem(commentsKey);
    const savedLikes = window.localStorage.getItem(likesKey);
    const savedClaps = window.localStorage.getItem(clapsKey);

    if (savedComments) {
      try {
        setComments(JSON.parse(savedComments) as LocalComment[]);
      } catch {
        setComments([]);
      }
    }

    setLikes(Number(savedLikes || 0));
    setClaps(Number(savedClaps || 0));

    const onScroll = () => {
      const article = document.getElementById("news-article-content");
      if (!article) return;

      const rect = article.getBoundingClientRect();
      const articleTop = rect.top + window.scrollY;
      const articleHeight = article.offsetHeight;
      const viewportBottom = window.scrollY + window.innerHeight;
      const raw = ((viewportBottom - articleTop) / Math.max(articleHeight, 1)) * 100;
      const bounded = Math.max(0, Math.min(100, raw));
      setProgress(bounded);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [post.slug]);

  function persistReactions(nextLikes: number, nextClaps: number) {
    window.localStorage.setItem(`news-likes:${post.slug}`, String(nextLikes));
    window.localStorage.setItem(`news-claps:${post.slug}`, String(nextClaps));
  }

  function handleCommentSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim() || !commentText.trim()) return;

    const next: LocalComment = {
      id: `${Date.now()}`,
      name: name.trim(),
      text: commentText.trim(),
      createdAt: new Date().toISOString(),
    };

    const updated = [next, ...comments].slice(0, 40);
    setComments(updated);
    window.localStorage.setItem(`news-comments:${post.slug}`, JSON.stringify(updated));
    setCommentText("");
  }

  async function shareArticle() {
    const payload = {
      title: post.title,
      text: post.subheading || post.metaDescription || post.title,
      url: window.location.href,
    };

    if (navigator.share) {
      await navigator.share(payload);
      return;
    }

    await navigator.clipboard.writeText(window.location.href);
  }

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-40 h-1 bg-ivory-200">
        <div className="h-full bg-gold transition-[width] duration-150" style={{ width: `${progress}%` }} />
      </div>

      <article className="container mx-auto px-6 max-w-7xl">
        <nav className="text-sm text-charcoal-600 mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2">
            <li><Link href="/" className="hover:text-navy-800">Home</Link></li>
            <li><ChevronRight className="w-4 h-4" /></li>
            <li><Link href="/news" className="hover:text-navy-800">News</Link></li>
            <li><ChevronRight className="w-4 h-4" /></li>
            <li className="text-navy-800 font-semibold line-clamp-1">{post.title}</li>
          </ol>
        </nav>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-12">
          <div>
            <header className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-wide text-gold mb-3">{post.category}</p>
              <h1 className="font-playfair text-4xl md:text-5xl font-bold text-navy-800 leading-tight mb-4">{post.title}</h1>
              {post.subheading && <p className="text-xl text-charcoal-700 leading-relaxed mb-4">{post.subheading}</p>}
              <div className="flex flex-wrap items-center gap-4 text-sm text-charcoal-500">
                <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                <span>•</span>
                <span>{readingTime} min read</span>
              </div>
            </header>

            {post.featuredImage?.url && (
              <div className="mb-10 rounded-lg overflow-hidden border border-ivory-300 bg-white shadow-sm relative aspect-[16/8]">
                <Image
                  src={getPostImageUrl(post, cmsBase)}
                  alt={post.featuredImage.alt || post.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 900px"
                  className="object-cover"
                />
              </div>
            )}

            <div className="flex items-center gap-3 mb-8">
              <button
                onClick={shareArticle}
                className="inline-flex items-center gap-2 rounded-full border border-ivory-300 bg-white px-4 py-2 text-sm text-charcoal-700 hover:bg-ivory-100"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
              <button
                onClick={() => {
                  const nextLikes = likes + 1;
                  setLikes(nextLikes);
                  persistReactions(nextLikes, claps);
                }}
                className="inline-flex items-center gap-2 rounded-full border border-ivory-300 bg-white px-4 py-2 text-sm text-charcoal-700 hover:bg-ivory-100"
              >
                <Heart className="w-4 h-4" />
                {likes}
              </button>
              <button
                onClick={() => {
                  const nextClaps = claps + 1;
                  setClaps(nextClaps);
                  persistReactions(likes, nextClaps);
                }}
                className="inline-flex items-center gap-2 rounded-full border border-ivory-300 bg-white px-4 py-2 text-sm text-charcoal-700 hover:bg-ivory-100"
              >
                <ThumbsUp className="w-4 h-4" />
                {claps}
              </button>
            </div>

            <div
              id="news-article-content"
              className="prose prose-slate max-w-none prose-headings:font-playfair prose-headings:text-navy-800 prose-p:text-charcoal-700 prose-a:text-navy-700 hover:prose-a:text-navy-900"
              dangerouslySetInnerHTML={{ __html: htmlWithAnchors }}
            />

            <section className="mt-16 rounded-xl border border-ivory-300 bg-white p-8 shadow-sm">
              <h2 className="font-playfair text-3xl font-bold text-navy-800 mb-5">Comments</h2>
              <form onSubmit={handleCommentSubmit} className="grid gap-4 mb-8">
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your name"
                  className="rounded-md border border-ivory-400 px-4 py-3 text-sm"
                />
                <textarea
                  value={commentText}
                  onChange={(event) => setCommentText(event.target.value)}
                  placeholder="Share your thoughts"
                  rows={4}
                  className="rounded-md border border-ivory-400 px-4 py-3 text-sm"
                />
                <button type="submit" className="w-fit rounded-md bg-navy-800 px-5 py-2.5 text-white text-sm font-semibold hover:bg-navy-900">
                  Post Comment
                </button>
              </form>

              <div className="space-y-4">
                {comments.length === 0 && (
                  <p className="text-sm text-charcoal-600">No comments yet. Start the discussion.</p>
                )}
                {comments.map((comment) => (
                  <div key={comment.id} className="rounded-md border border-ivory-300 p-4">
                    <div className="flex items-center gap-2 text-xs text-charcoal-500 mb-2">
                      <MessageCircle className="w-3 h-3" />
                      <span>{comment.name}</span>
                      <span>•</span>
                      <span>{formatDate(comment.createdAt)}</span>
                    </div>
                    <p className="text-sm text-charcoal-700 leading-relaxed">{comment.text}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-12 rounded-xl border border-ivory-300 bg-navy-900 px-8 py-10 text-white">
              <h2 className="font-playfair text-3xl font-bold mb-4">Get Weekly Commerce Insights</h2>
              <p className="text-sm text-ivory-200 mb-6">Join our newsletter for strategy notes and market updates from the GNG team.</p>
              <NewsletterSignup />
            </section>
          </div>

          <aside className="space-y-8">
            {headings.length > 0 && (
              <section className="rounded-lg border border-ivory-300 bg-white p-5 shadow-sm sticky top-32">
                <h2 className="font-inter text-sm uppercase tracking-wide text-charcoal-500 mb-3">Table Of Contents</h2>
                <ul className="space-y-2">
                  {headings.map((heading) => (
                    <li key={heading.id} className={heading.level === 3 ? "pl-4" : ""}>
                      <a href={`#${heading.id}`} className="text-sm text-navy-700 hover:text-navy-900">
                        {heading.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {relatedPosts.length > 0 && (
              <section className="rounded-lg border border-ivory-300 bg-white p-5 shadow-sm">
                <h2 className="font-playfair text-2xl font-bold text-navy-800 mb-4">Related Posts</h2>
                <div className="space-y-4">
                  {relatedPosts.map((item) => (
                    <Link key={item._id} href={`/news/${item.slug}`} className="block border-b border-ivory-200 pb-3 last:border-0">
                      <p className="text-xs text-charcoal-500 mb-1">{item.category}</p>
                      <h3 className="text-sm font-semibold text-navy-800 line-clamp-2">{item.title}</h3>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {recommendedPosts.length > 0 && (
              <section className="rounded-lg border border-ivory-300 bg-white p-5 shadow-sm">
                <h2 className="font-playfair text-2xl font-bold text-navy-800 mb-4">Recommended</h2>
                <div className="space-y-4">
                  {recommendedPosts.map((item) => (
                    <Link key={item._id} href={`/news/${item.slug}`} className="block border-b border-ivory-200 pb-3 last:border-0">
                      <p className="text-xs text-charcoal-500 mb-1">{item.category}</p>
                      <h3 className="text-sm font-semibold text-navy-800 line-clamp-2">{item.title}</h3>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </aside>
        </div>
      </article>
    </>
  );
}
