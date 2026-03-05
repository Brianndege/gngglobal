"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Tag, ArrowRight, Flame, Search, Filter, Compass } from "lucide-react";
import { ScrollReveal, StaggeredGrid } from "@/components/ScrollReveal";
import { CmsPost, getCmsApiBaseUrl } from "@/lib/cms";
import { extractTags, getPostImageUrl, getReadingTimeMinutes, getTrendingScore, stripHtml } from "@/lib/blog";

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

interface NewsClientContentProps {
  initialData?: NewsApiResponse;
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

  const plainText = stripHtml(post.content);
  return plainText.slice(0, 220) + (plainText.length > 220 ? "…" : "");
}

export default function NewsClientContent({ initialData }: NewsClientContentProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTag, setSelectedTag] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [posts, setPosts] = useState<CmsPost[]>(initialData?.posts || []);
  const [categories, setCategories] = useState<string[]>(initialData ? ["All", ...initialData.categories] : []);
  const [page, setPage] = useState(initialData?.pagination.page || 1);
  const [hasMore, setHasMore] = useState(initialData?.pagination.hasMore || false);
  const [isLoading, setIsLoading] = useState(!initialData);
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

    setPosts((previous) => {
      if (replace) return data.posts;
      const map = new Map<string, CmsPost>();
      [...previous, ...data.posts].forEach((post) => map.set(post._id, post));
      return Array.from(map.values());
    });
  }, [baseUrl, selectedCategory]);

  useEffect(() => {
    if (initialData && selectedCategory === "All") {
      return;
    }

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
  }, [initialData, loadPosts, selectedCategory]);

  const tags = useMemo(() => {
    const allTags = posts.flatMap((post) => extractTags(post));
    return ["All", ...Array.from(new Set(allTags)).slice(0, 12)];
  }, [posts]);

  const searchResults = useMemo(() => {
    const normalizedTerm = searchTerm.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesTag = selectedTag === "All" || extractTags(post).includes(selectedTag);
      if (!normalizedTerm) return matchesTag;

      const haystack = `${post.title} ${post.subheading || ""} ${post.metaDescription || ""} ${post.category} ${stripHtml(post.content)}`.toLowerCase();
      return matchesTag && haystack.includes(normalizedTerm);
    });
  }, [posts, searchTerm, selectedTag]);

  const rankedPosts = useMemo(() => {
    return [...searchResults].sort((a, b) => getTrendingScore(b) - getTrendingScore(a));
  }, [searchResults]);

  const featuredArticle = rankedPosts[0];
  const trendingPosts = rankedPosts.slice(0, 3);
  const recommendedPosts = rankedPosts.slice(3, 6);
  const newsItems = rankedPosts.slice(1);

  function renderPostImage(post: CmsPost, className: string, priority?: boolean) {
    const imageUrl = getPostImageUrl(post, baseUrl);

    if (!imageUrl) {
      return <div className={`w-full h-full bg-gradient-to-br from-navy-900 to-charcoal-900 ${className}`} />;
    }

    return (
      <Image
        src={imageUrl}
        alt={post.featuredImage?.alt || post.title}
        fill
        sizes="(max-width: 1024px) 100vw, 50vw"
        className={`object-cover group-hover:scale-105 transition-transform duration-700 ${className}`}
        priority={Boolean(priority)}
      />
    );
  }

  return (
    <>
      <section className="pt-10 pb-4 section-premium-light">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <nav className="text-sm text-charcoal-600" aria-label="Breadcrumb">
              <ol className="flex items-center gap-2">
                <li><Link href="/" className="hover:text-navy-800">Home</Link></li>
                <li>/</li>
                <li className="text-navy-800 font-semibold">News</li>
              </ol>
            </nav>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 section-premium-light">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal direction="up">
              <div className="mb-10 rounded-xl border border-ivory-300 bg-white/90 p-6 shadow-sm">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="md:col-span-2 relative">
                    <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-500" />
                    <input
                      type="search"
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      placeholder="Search by title, topic, or keyword"
                      className="w-full rounded-md border border-ivory-400 bg-white pl-11 pr-4 py-3 text-sm text-charcoal-700 focus:outline-none focus:ring-2 focus:ring-navy-700"
                    />
                  </div>
                  <div className="flex items-center gap-2 rounded-md border border-ivory-400 bg-ivory-50 px-4 py-3 text-sm text-charcoal-700">
                    <Filter className="w-4 h-4 text-navy-700" />
                    <span>{rankedPosts.length} posts match your filters</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>

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
                        {renderPostImage(featuredArticle, "", true)}
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

                        <p className="text-xs text-charcoal-500 mb-6">{getReadingTimeMinutes(featuredArticle.content)} min read</p>

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

      {!isLoading && trendingPosts.length > 0 && (
        <section className="pb-16 section-premium-light">
          <div className="container mx-auto px-6">
            <div className="max-w-7xl mx-auto">
              <ScrollReveal direction="up">
                <div className="flex items-center gap-2 mb-6 text-navy-800">
                  <Flame className="w-5 h-5 text-gold" />
                  <h2 className="font-playfair text-3xl font-bold">Trending Now</h2>
                </div>
              </ScrollReveal>

              <StaggeredGrid pattern="diagonal" className="grid md:grid-cols-3 gap-6">
                {trendingPosts.map((post) => (
                  <Link href={`/news/${post.slug}`} key={post._id} className="group rounded-lg border border-ivory-300 bg-white shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300">
                    <div className="relative h-44 overflow-hidden">
                      {renderPostImage(post, "")}
                    </div>
                    <div className="p-5">
                      <p className="text-xs text-charcoal-500 mb-2">{formatDate(post.publishedAt || post.createdAt)}</p>
                      <h3 className="font-playfair text-xl font-bold text-navy-800 group-hover:text-navy-900 line-clamp-2">{post.title}</h3>
                    </div>
                  </Link>
                ))}
              </StaggeredGrid>
            </div>
          </div>
        </section>
      )}

      <section className="py-8 section-premium-neutral border-y border-ivory-300/70">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal direction="up">
              <div className="flex flex-wrap gap-3 justify-center">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      setSelectedTag("All");
                    }}
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

            <ScrollReveal direction="up" delay={0.1}>
              <div className="flex flex-wrap gap-3 justify-center mt-5">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`px-4 py-1.5 rounded-full font-inter text-xs font-semibold transition-all duration-300 ${
                      tag === selectedTag
                        ? "bg-gold text-navy-900"
                        : "bg-white text-charcoal-700 hover:bg-gold hover:text-navy-900 border border-charcoal-300"
                    }`}
                  >
                    #{tag}
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
                          {renderPostImage(article, "group-hover:scale-110")}
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

                          <p className="text-xs text-charcoal-500 mb-5">{getReadingTimeMinutes(article.content)} min read</p>

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

            {!isLoading && recommendedPosts.length > 0 && (
              <ScrollReveal direction="up" delay={0.2}>
                <div className="mt-20 rounded-xl border border-ivory-300 bg-white p-8 shadow-sm">
                  <div className="flex items-center gap-2 mb-6 text-navy-800">
                    <Compass className="w-5 h-5 text-gold" />
                    <h3 className="font-playfair text-3xl font-bold">Recommended For You</h3>
                  </div>
                  <div className="grid md:grid-cols-3 gap-5">
                    {recommendedPosts.map((post) => (
                      <Link
                        key={post._id}
                        href={`/news/${post.slug}`}
                        className="rounded-md border border-ivory-300 p-4 hover:border-navy-400 hover:bg-ivory-100/60 transition-all"
                      >
                        <p className="text-xs text-charcoal-500 mb-2">{post.category}</p>
                        <h4 className="font-inter text-sm font-semibold text-navy-800 line-clamp-2">{post.title}</h4>
                      </Link>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
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
