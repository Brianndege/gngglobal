import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-ivory-50 flex items-center justify-center px-6">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Number */}
        <div className="font-playfair text-8xl md:text-9xl font-bold text-navy-800/10 mb-4 select-none">
          404
        </div>

        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-gold/20 to-gold/5 rounded-full flex items-center justify-center">
            <Home className="w-10 h-10 text-gold" />
          </div>
        </div>

        {/* Content */}
        <h1 className="font-playfair text-3xl md:text-4xl font-bold text-navy-800 mb-4">
          Page Not Found
        </h1>
        <div className="w-16 h-1 bg-gold mx-auto mb-6" />
        <p className="font-inter text-lg text-charcoal-600 leading-relaxed mb-10">
          The page you are looking for doesn&apos;t exist or has been moved. Let&apos;s get you
          back on track.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button
              size="lg"
              className="bg-navy-800 hover:bg-navy-900 text-white px-8 font-inter font-semibold"
            >
              <Home className="mr-2 w-5 h-5" />
              Return Home
            </Button>
          </Link>
          <Link href="/contact">
            <Button
              size="lg"
              variant="outline"
              className="border-gold text-gold hover:bg-gold hover:text-white px-8 font-inter font-semibold"
            >
              <ArrowLeft className="mr-2 w-5 h-5" />
              Contact Us
            </Button>
          </Link>
        </div>

        {/* Quick Links */}
        <div className="mt-16 pt-8 border-t border-ivory-300">
          <p className="font-inter text-sm text-charcoal-500 mb-4">You might be looking for:</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {[
              { label: "About Us", href: "/about" },
              { label: "Portfolio", href: "/portfolio" },
              { label: "News & Media", href: "/news" },
              { label: "Our Team", href: "/team" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-inter text-sm text-navy-800 hover:text-gold transition-colors px-4 py-2 bg-white rounded-full border border-ivory-300 hover:border-gold/50"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
