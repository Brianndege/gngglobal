import Link from "next/link";
import { Linkedin, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-navy-900 via-navy-800 to-charcoal-900 text-white">
      {/* Main Footer Content */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-6 py-16 md:py-20">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <div className="text-2xl md:text-3xl font-bold font-playfair tracking-tight mb-2">
                  GNG <span className="font-normal">GLOBAL</span>
                </div>
                <div className="text-ivory-200 text-sm mb-6">Investment Group</div>
              </div>
              <p className="font-inter text-ivory-200 leading-relaxed max-w-lg mb-8">
                GNG Global Investment Group is an investment firm founded in Perth, Australia. We have numerous strategic investments in a wide range of sectors and asset classes.
              </p>

              {/* Social Links */}
              <div className="flex items-center gap-4">
                <a
                  href="https://www.linkedin.com/company/gng-global/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10 hover:bg-gold hover:text-navy-900 transition-all duration-300"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-playfair text-lg font-bold mb-6">Quick Links</h3>
              <ul className="space-y-3">
                {[
                  { label: "About Us", href: "/about" },
                  { label: "Portfolio", href: "/portfolio" },
                  { label: "News & Insights", href: "/news" },
                  { label: "Our Team", href: "/team" },
                  { label: "Contact", href: "/contact" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="font-inter text-ivory-200 hover:text-gold transition-colors inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="font-playfair text-lg font-bold mb-6">Contact</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <div className="font-inter text-ivory-200 text-sm leading-relaxed">
                    136 Stirling Highway<br />
                    Nedlands WA 6009
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gold flex-shrink-0" />
                  <a
                    href="tel:0893058580"
                    className="font-inter text-ivory-200 text-sm hover:text-gold transition-colors"
                  >
                    (08) 9305 8580
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gold flex-shrink-0" />
                  <a
                    href="mailto:info@gngglobal.com.au"
                    className="font-inter text-ivory-200 text-sm hover:text-gold transition-colors"
                  >
                    info@gngglobal.com.au
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Land Acknowledgement */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-6 py-8">
          <p className="font-inter text-sm text-ivory-200 leading-relaxed text-center max-w-4xl mx-auto italic">
            The GNG Global Investment Group and its subsidiaries acknowledge the Traditional Owners of the lands and waters on which we work, live and engage. We pay our respects to elders past and present.
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="container mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="font-inter text-sm text-ivory-300">
            © {new Date().getFullYear()} GNG Global Investment Group Pty Ltd and its related entities. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="font-inter text-sm text-ivory-300 hover:text-gold transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="font-inter text-sm text-ivory-300 hover:text-gold transition-colors"
            >
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
