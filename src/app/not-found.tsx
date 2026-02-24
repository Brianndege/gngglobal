import Link from "next/link";
import EnhancedNavigation from "@/components/EnhancedNavigation";
import Footer from "@/components/Footer";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  {
    label: "Portfolio",
    href: "/portfolio",
    children: [
      { label: "All Companies", href: "/portfolio" },
      { label: "GNG Healthcare Group", href: "/portfolio/healthcare" },
      { label: "GNG Property Group", href: "/portfolio/property" },
      { label: "Scenes", href: "/portfolio/scenes" },
    ],
  },
  { label: "News & Media", href: "/news" },
  { label: "Team", href: "/team" },
  { label: "Contact", href: "/contact" },
];

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-ivory-50">
      <EnhancedNavigation items={navItems} />

      <main className="flex-grow flex items-center justify-center py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <span className="font-playfair text-9xl font-bold text-navy-800 opacity-10 select-none">
                404
              </span>
            </div>
            <h1 className="font-playfair text-4xl md:text-5xl font-bold text-navy-800 mb-6 -mt-8">
              Page Not Found
            </h1>
            <div className="w-24 h-1 bg-gold mx-auto mb-8" />
            <p className="font-inter text-xl text-charcoal-600 mb-10 leading-relaxed">
              The page you&apos;re looking for doesn&apos;t exist or has been moved. Please check the URL or return to our homepage.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="inline-block px-10 py-4 bg-navy-800 hover:bg-navy-900 text-white font-inter font-semibold rounded-md transition-all duration-300 hover:shadow-xl"
              >
                Return Home
              </Link>
              <Link
                href="/contact"
                className="inline-block px-10 py-4 border-2 border-navy-800 text-navy-800 hover:bg-navy-800 hover:text-white font-inter font-semibold rounded-md transition-all duration-300"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
