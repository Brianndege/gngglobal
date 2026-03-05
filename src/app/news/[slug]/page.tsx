import type { Metadata } from "next";
import EnhancedNavigation from "@/components/EnhancedNavigation";
import Footer from "@/components/Footer";
import { primaryNavItems } from "@/lib/site";
import { fetchPublishedPostBySlug, fetchPublishedPosts } from "@/lib/cms";
import NewsPostEnhancements from "@/components/news/NewsPostEnhancements";
import { getBreadcrumbJsonLd, stringifyJsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { getTrendingScore } from "@/lib/blog";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 300;

export async function generateStaticParams() {
  try {
    const data = await fetchPublishedPosts({ page: 1, limit: 100 });
    return data.posts.map((post) => ({ slug: post.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const post = await fetchPublishedPostBySlug(slug);
    return {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.subheading || post.title,
      alternates: { canonical: `/news/${post.slug}` },
    };
  } catch {
    return {
      title: "News Article",
    };
  }
}

export default async function NewsPostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await fetchPublishedPostBySlug(slug);
  const allPosts = (await fetchPublishedPosts({ page: 1, limit: 100 })).posts.filter((item) => item.slug !== slug);

  const relatedPosts = allPosts
    .filter((item) => item.category === post.category)
    .slice(0, 4);

  const recommendedPosts = allPosts
    .filter((item) => item.category !== post.category)
    .sort((a, b) => getTrendingScore(b) - getTrendingScore(a))
    .slice(0, 4);

  const breadcrumbJsonLd = stringifyJsonLd(getBreadcrumbJsonLd([
    { name: "Home", item: `${siteConfig.url}/` },
    { name: "News", item: `${siteConfig.url}/news` },
    { name: post.title, item: `${siteConfig.url}/news/${post.slug}` },
  ]));

  const articleJsonLd = stringifyJsonLd({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.metaTitle || post.title,
    description: post.metaDescription || post.subheading || post.title,
    articleSection: post.category,
    datePublished: post.publishedAt || post.publishDate || post.createdAt,
    dateModified: post.updatedAt,
    mainEntityOfPage: `${siteConfig.url}/news/${post.slug}`,
    author: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    image: post.featuredImage?.url || undefined,
    keywords: [post.category],
  });

  return (
    <div className="min-h-screen flex flex-col bg-ivory-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: breadcrumbJsonLd }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: articleJsonLd }}
      />

      <EnhancedNavigation items={primaryNavItems} />

      <main id="main-content" className="flex-grow pt-28 md:pt-32 pb-20">
        <NewsPostEnhancements
          post={post}
          relatedPosts={relatedPosts}
          recommendedPosts={recommendedPosts}
        />
      </main>

      <Footer />
    </div>
  );
}
