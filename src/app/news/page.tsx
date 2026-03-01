import EnhancedNavigation from "@/components/EnhancedNavigation";
import Footer from "@/components/Footer";
import LegalHero from "@/components/LegalHero";
import { ScrollReveal } from "@/components/ScrollReveal";
import { primaryNavItems } from "@/lib/site";
import NewsClientContent from "@/components/news/NewsClientContent";
import NewsletterSignup from "@/components/news/NewsletterSignup";

export const metadata = {
  title: "News & Media - GNG Global Investment Group",
  description: "Latest insights, updates, and thought leadership from GNG Global Investment Group.",
};

export default function NewsPage() {
  return (
    <div className="premium-site-shell">
      <EnhancedNavigation items={primaryNavItems} />

      <main id="main-content" className="premium-page-main">
        {/* Hero Section */}
        <LegalHero
          title="News & Insights"
          subtitle="Latest updates, thought leadership, and strategic insights from GNG Global"
          image="https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1920&q=90"
          height="md"
        />

        <NewsClientContent />

        {/* Newsletter Signup */}
        <section className="py-20 md:py-28 section-premium-dark section-premium-dark--tempered text-white">
          <div className="container mx-auto px-6">
            <ScrollReveal direction="scale">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6">
                  Stay Informed
                </h2>
                <div className="w-24 h-1 bg-gold mx-auto mb-8"></div>
                <p className="font-inter text-xl text-ivory-200 mb-10 leading-relaxed">
                  Subscribe to receive the latest insights, updates, and thought leadership from GNG Global Investment Group
                </p>
                <NewsletterSignup />
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
