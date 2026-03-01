import type { Metadata } from "next";
import Link from "next/link";
import EnhancedNavigation from "@/components/EnhancedNavigation";
import Footer from "@/components/Footer";
import { primaryNavItems } from "@/lib/site";
import { fetchPublishedPostBySlug, getCmsApiBaseUrl } from "@/lib/cms";

interface PostPageProps {
  params: Promise<{ slug: string }>;
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
  const cmsBase = getCmsApiBaseUrl();

  return (
    <div className="min-h-screen flex flex-col bg-ivory-50">
      <EnhancedNavigation items={primaryNavItems} />

      <main id="main-content" className="flex-grow pt-28 md:pt-32 pb-20">
        <article className="container mx-auto px-6 max-w-4xl">
          <Link href="/news" className="inline-flex items-center text-sm font-semibold text-navy-700 hover:text-navy-900 mb-8">
            ← Back to News
          </Link>

          <header className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-gold mb-3">{post.category}</p>
            <h1 className="font-playfair text-4xl md:text-5xl font-bold text-navy-800 leading-tight mb-4">{post.title}</h1>
            {post.subheading && <p className="text-xl text-charcoal-700 leading-relaxed mb-4">{post.subheading}</p>}
            <p className="text-sm text-charcoal-500">{formatDate(post.publishedAt || post.createdAt)}</p>
          </header>

          {post.featuredImage?.url && (
            <div className="mb-10 rounded-lg overflow-hidden border border-ivory-300 bg-white shadow-sm">
              <img
                src={post.featuredImage.url.startsWith("/") ? `${cmsBase}${post.featuredImage.url}` : post.featuredImage.url}
                alt={post.featuredImage.alt || post.title}
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          <div
            className="prose prose-slate max-w-none prose-headings:font-playfair prose-headings:text-navy-800 prose-p:text-charcoal-700 prose-a:text-navy-700 hover:prose-a:text-navy-900"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </main>

      <Footer />
    </div>
  );
}
