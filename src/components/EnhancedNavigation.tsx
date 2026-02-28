"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu as MenuIcon, X, ChevronDown } from "lucide-react";
import { type NavItem, siteConfig } from "@/lib/site";

interface EnhancedNavigationProps {
  items: NavItem[];
  logo?: React.ReactNode;
}

export default function EnhancedNavigation({ items, logo }: EnhancedNavigationProps) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedMobileItems, setExpandedMobileItems] = useState<Set<string>>(new Set());
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
      mobileMenuRef.current?.querySelector<HTMLElement>("[tabindex='0']")?.focus();
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const toggleMobileSubmenu = (label: string) => {
    setExpandedMobileItems((prev) => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent, onEnter: () => void) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onEnter();
    }
  };

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-navy-900 focus:shadow-md"
      >
        Skip to main content
      </a>

      {/* Main Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 shadow-md backdrop-blur-md py-3"
            : "bg-white/85 backdrop-blur-md py-4"
        }`}
        aria-label="Main navigation"
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group" aria-label={siteConfig.name}>
              {logo || (
                <>
                  <div className="text-2xl font-bold text-navy-700 tracking-tight">
                    GNG <span className="font-normal">GLOBAL</span>
                  </div>
                  <div className="hidden sm:block text-sm text-charcoal-500 border-l pl-3 ml-3">
                    Investment Group
                  </div>
                </>
              )}
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {items.map((item) =>
                item.children && item.children.length > 0 ? (
                  <div key={item.label} className="relative group">
                    <button
                      type="button"
                      className="flex items-center gap-1 text-sm font-medium text-charcoal-700 hover:text-navy-700 transition-colors duration-200 py-2"
                      aria-haspopup="menu"
                      aria-expanded="false"
                    >
                      {item.label}
                      <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180" />
                    </button>

                    <div className="invisible opacity-0 pointer-events-none group-hover:visible group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:visible group-focus-within:opacity-100 group-focus-within:pointer-events-auto transition-all duration-200 absolute left-0 mt-2 w-56 origin-top-left bg-white rounded-xl shadow-lg ring-1 ring-black/5">
                      <div className="py-1" role="menu" aria-label={`${item.label} submenu`}>
                        {item.children?.map((child) => (
                          <Link
                            key={child.label}
                            href={child.href}
                            role="menuitem"
                            className={`block px-4 py-2 text-sm hover:bg-muted hover:text-navy-700 ${
                              pathname === child.href ? "bg-muted text-navy-700" : "text-charcoal-700"
                            }`}
                            aria-current={pathname === child.href ? "page" : undefined}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`text-sm font-medium transition-colors duration-200 ${
                      pathname === item.href ? "text-navy-700" : "text-charcoal-700 hover:text-navy-700"
                    }`}
                    aria-current={pathname === item.href ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                )
              )}
            </div>

            {/* Utility Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/contact"
                className="hidden md:inline-block bg-navy-700 hover:bg-navy-800 text-white font-semibold px-5 py-2 rounded-md transition-colors duration-300"
              >
                Contact Us
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-charcoal-700 hover:text-navy-700 transition-colors duration-200"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-nav-panel"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <MenuIcon className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              ref={mobileMenuRef}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              id="mobile-nav-panel"
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white z-50 lg:hidden overflow-y-auto"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation menu"
            >
              <div className="p-6">
                {/* Close Button */}
                <div className="flex justify-end mb-6">
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 text-charcoal-700 hover:text-navy-700 transition-colors duration-200"
                    aria-label="Close menu"
                    tabIndex={0}
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Mobile Navigation Items */}
                <nav className="space-y-1">
                  {items.map((item) => (
                    <div key={item.label}>
                      {item.children && item.children.length > 0 ? (
                        <div>
                          <button
                            onClick={() => toggleMobileSubmenu(item.label)}
                            onKeyDown={(e) =>
                              handleKeyDown(e, () => toggleMobileSubmenu(item.label))
                            }
                            className="w-full flex items-center justify-between p-3 text-left text-charcoal-900 hover:bg-muted rounded-md transition-colors duration-200"
                            aria-expanded={expandedMobileItems.has(item.label)}
                          >
                            <span className="font-medium">{item.label}</span>
                            <ChevronDown
                              className={`w-5 h-5 transition-transform duration-200 ${
                                expandedMobileItems.has(item.label) ? "rotate-180" : ""
                              }`}
                            />
                          </button>

                          <AnimatePresence>
                            {expandedMobileItems.has(item.label) && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="pl-4 space-y-1 mt-1">
                                  {item.children?.map((child) => (
                                    <Link
                                      key={child.label}
                                      href={child.href}
                                      onClick={() => setIsMobileMenuOpen(false)}
                                      className="block p-3 text-charcoal-700 hover:bg-muted rounded-md transition-colors duration-200"
                                      aria-current={pathname === child.href ? "page" : undefined}
                                    >
                                      {child.label}
                                    </Link>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <Link
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block p-3 text-charcoal-900 hover:bg-muted rounded-md transition-colors duration-200 font-medium"
                          aria-current={pathname === item.href ? "page" : undefined}
                        >
                          {item.label}
                        </Link>
                      )}
                    </div>
                  ))}
                </nav>

                {/* Mobile CTA */}
                <div className="mt-8 pt-8 border-t">
                  <Link
                    href="/contact"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-center bg-navy-700 hover:bg-navy-800 text-white font-semibold px-6 py-3 rounded-md transition-colors duration-300"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
