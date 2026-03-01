"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Calendar, Tag, ArrowRight } from "lucide-react";
import { ScrollReveal, StaggeredGrid } from "@/components/ScrollReveal";
import { CmsPost, getCmsApiBaseUrl } from "@/lib/cms";

interface NewsApiResponse {
  posts: CmsPost[];
  categories: string[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
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

function excerpt(post: CmsPost) {
  if (post.subheading?.trim()) return post.subheading;

  const plainText = post.content.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  return plainText.slice(0, 220) + (plainText.length > 220 ? "…" : "");
}

export default function NewsClientContent() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [posts, setPosts] = useState<CmsPost[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = useMemo(() => getCmsApiBaseUrl(), []);

  const loadPosts = useCallback(async (nextPage: number, replace = false) => {
    const query = new URLSearchParams({ page: String(nextPage), limit: "5" });
    if (selectedCategory !== "All") query.set("category", selectedCategory);

    const response = await fetch(`${baseUrl}/api/posts?${query.toString()}`, { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Unable to load news posts");
    }

    const data = (await response.json()) as NewsApiResponse;

    setCategories(["All", ...data.categories]);
    setHasMore(data.pagination.hasMore);
    setPage(nextPage);

    setPosts((previous) => (replace ? data.posts : [...previous, ...data.posts]));
  }, [baseUrl, selectedCategory]);

  useEffect(() => {
    let mounted = true;

    async function run() {
      setIsLoading(true);
      setError(null);

      try {
        await loadPosts(1, true);
      } catch (err) {
        if (mounted) setError(err instanceof Error ? err.message : "Failed to load posts");
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    run();
    return () => {
      mounted = false;
    };
  }, [loadPosts]);

  const featuredArticle = posts[0];
  const newsItems = posts.slice(1);

  return (
    <>
      <section className="py-20 md:py-28 section-premium-light">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal direction="up">
              <div className="mb-12">
                <div className="inline-block mb-6">
                  <span className="font-inter text-sm font-semibold tracking-wider text-gold uppercase border-b-2 border-gold pb-2">
                    Featured Article
                  </span>
                </div>
              </div>
            </ScrollReveal>

            {isLoading ? (
              <div className="animate-pulse h-[28rem] rounded-lg border border-ivory-300 bg-ivory-100" />
            ) : featuredArticle ? (
              <ScrollReveal direction="scale" delay={0.2}>
                <Link href={`/news/${featuredArticle.slug}`}>
                  <div className="group relative bg-white rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-ivory-300">
                    <div className="grid lg:grid-cols-5 gap-0">
                      <div className="lg:col-span-3 relative h-96 lg:h-auto overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-navy-900/60 via-navy-900/40 to-transparent z-10" />
                        {featuredArticle.featuredImage?.url ? (
                          <img
                            src={featuredArticle.featuredImage.url}
                            alt={featuredArticle.featuredImage.alt || featuredArticle.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-navy-900 to-charcoal-900" />
                        )}
                        <div className="absolute top-6 left-6 z-20">
                          <div className="inline-flex items-center gap-2 bg-gold/95 backdrop-blur-sm text-navy-900 px-4 py-2 rounded-full">
                            <Tag className="w-4 h-4" />
                            <span className="font-inter text-sm font-semibold">{featuredArticle.category}</span>
                          </div>
                        </div>
                      </div>

                      <div className="lg:col-span-2 p-8 lg:p-12 flex flex-col justify-center">
                        <div className="flex items-center gap-2 text-charcoal-600 mb-4">
                          <Calendar className="w-4 h-4" />
                          <span className="font-inter text-sm">{formatDate(featuredArticle.publishedAt || featuredArticle.createdAt)}</span>
                        </div>

                        <h2 className="font-playfair text-3xl lg:text-4xl font-bold text-navy-800 mb-6 group-hover:text-navy-900 transition-colors leading-tight">
                          {featuredArticle.title}
                        </h2>

                        <p className="font-inter text-lg text-charcoal-700 leading-relaxed mb-8">{excerpt(featuredArticle)}</p>

                        <div className="flex items-center text-gold group-hover:text-gold-700 font-semibold">
                          <span>Read Full Article</span>
                          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ) : (
              <div className="rounded-lg border border-ivory-300 bg-ivory-100 p-8 text-center text-charcoal-600">
                No published posts available yet.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-8 section-premium-neutral border-y border-ivory-300/70">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal direction="up">
              <div className="flex flex-wrap gap-3 justify-center">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-6 py-2 rounded-full font-inter text-sm font-medium transition-all duration-300 ${
                      category === selectedCategory
                        ? "bg-navy-800 text-white"
                        : "bg-white text-charcoal-700 hover:bg-navy-800 hover:text-white border border-charcoal-300"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 section-premium-neutral section-premium-neutral--crisp section-premium-divider">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal direction="up">
              <div className="text-center mb-16">
                <h2 className="font-playfair text-4xl md:text-5xl font-bold text-navy-800 mb-6">Latest Updates</h2>
                <div className="w-24 h-1 bg-gold mx-auto" />
              </div>
            </ScrollReveal>

            {error ? (
              <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-6 text-center text-destructive">
                {error}
              </div>
            ) : (
              <StaggeredGrid pattern="wave" className="grid md:grid-cols-2 lg:grid-cols-2 gap-10">
                {newsItems.map((article) => (
                  <div key={article._id}>
                    <Link href={`/news/${article.slug}`}>
                      <div className="group bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-ivory-300 h-full">
                        <div className="relative h-64 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-navy-900/20 to-transparent z-10" />
                          {article.featuredImage?.url ? (
                            <img
                              src={article.featuredImage.url}
                              alt={article.featuredImage.alt || article.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-navy-900 to-charcoal-900" />
                          )}
                          <div className="absolute top-4 left-4 z-20">
                            <div className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-sm text-navy-900 px-3 py-1.5 rounded-full">
                              <Tag className="w-3 h-3" />
                              <span className="font-inter text-xs font-semibold">{article.category}</span>
                            </div>
                          </div>
                          <div className="absolute bottom-4 left-4 z-20">
                            <div className="inline-flex items-center gap-2 bg-gold/95 backdrop-blur-sm text-navy-900 px-3 py-1.5 rounded-full">
                              <Calendar className="w-3 h-3" />
                              <span className="font-inter text-xs font-semibold">{formatDate(article.publishedAt || article.createdAt)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="p-6">
                          <h3 className="font-playfair text-2xl font-bold text-navy-800 mb-4 group-hover:text-navy-900 transition-colors leading-tight line-clamp-2">
                            {article.title}
                          </h3>

                          <p className="font-inter text-charcoal-600 leading-relaxed mb-6 line-clamp-3">{excerpt(article)}</p>

                          <div className="flex items-center text-gold group-hover:text-gold-700 font-semibold text-sm">
                            <span>Read More</span>
                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </StaggeredGrid>
            )}

            {hasMore && !error && (
              <ScrollReveal direction="up" delay={0.4}>
                <div className="text-center mt-16">
                  <button
                    disabled={isLoadingMore}
                    onClick={async () => {
                      setIsLoadingMore(true);
                      try {
                        await loadPosts(page + 1, false);
                      } catch (err) {
                        setError(err instanceof Error ? err.message : "Failed to load more posts");
                      } finally {
                        setIsLoadingMore(false);
                      }
                    }}
                    className="px-10 py-4 bg-navy-800 hover:bg-navy-900 text-white font-inter font-semibold rounded-md transition-all duration-300 hover:shadow-xl disabled:opacity-60"
                  >
                    {isLoadingMore ? "Loading..." : "Load More Articles"}
                  </button>
                </div>
              </ScrollReveal>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
