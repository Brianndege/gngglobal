"use client";

import { useState, useEffect, useRef, Fragment } from "react";
import Link from "next/link";
import { Menu, Transition } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu as MenuIcon, X, ChevronDown, Search } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

interface EnhancedNavigationProps {
  items: NavItem[];
  logo?: React.ReactNode;
}

export default function EnhancedNavigation({ items, logo }: EnhancedNavigationProps) {
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
      {/* Main Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white shadow-card py-3"
            : "bg-white/95 backdrop-blur-sm py-4"
        }`}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              {logo || (
                <>
                  <div className="text-2xl font-bold font-playfair text-navy-700 tracking-tight">
                    GNG <span className="font-normal">GLOBAL</span>
                  </div>
                  <div className="hidden sm:block text-sm text-charcoal-400 border-l pl-3 ml-3">
                    Investment Group
                  </div>
                </>
              )}
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {items.map((item) =>
                item.children && item.children.length > 0 ? (
                  <Menu as="div" key={item.label} className="relative">
                    {({ open }) => (
                      <>
                        <Menu.Button className="flex items-center gap-1 text-sm font-medium text-charcoal-700 hover:text-navy-700 transition-colors duration-200 py-2">
                          {item.label}
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${
                              open ? "rotate-180" : ""
                            }`}
                          />
                        </Menu.Button>

                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-200"
                          enterFrom="opacity-0 translate-y-1"
                          enterTo="opacity-100 translate-y-0"
                          leave="transition ease-in duration-150"
                          leaveFrom="opacity-100 translate-y-0"
                          leaveTo="opacity-0 translate-y-1"
                        >
                          <Menu.Items className="absolute left-0 mt-2 w-56 origin-top-left bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="py-1">
                              {item.children?.map((child) => (
                                <Menu.Item key={child.label}>
                                  {({ active }) => (
                                    <Link
                                      href={child.href}
                                      className={`block px-4 py-2 text-sm ${
                                        active
                                          ? "bg-ivory-200 text-navy-700"
                                          : "text-charcoal-700"
                                      }`}
                                    >
                                      {child.label}
                                    </Link>
                                  )}
                                </Menu.Item>
                              ))}
                            </div>
                          </Menu.Items>
                        </Transition>
                      </>
                    )}
                  </Menu>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="text-sm font-medium text-charcoal-700 hover:text-navy-700 transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                )
              )}
            </div>

            {/* Utility Actions */}
            <div className="flex items-center gap-3">
              <button
                className="p-2 text-charcoal-700 hover:text-navy-700 transition-colors duration-200"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              <Link
                href="/contact"
                className="hidden md:inline-block bg-gold hover:bg-gold-600 text-white font-semibold px-6 py-2 rounded-md transition-colors duration-300"
              >
                Contact Us
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-charcoal-700 hover:text-navy-700 transition-colors duration-200"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileMenuOpen}
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
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white z-50 lg:hidden overflow-y-auto"
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
                            className="w-full flex items-center justify-between p-3 text-left text-charcoal-900 hover:bg-ivory-200 rounded-md transition-colors duration-200"
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
                                      className="block p-3 text-charcoal-700 hover:bg-ivory-200 rounded-md transition-colors duration-200"
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
                          className="block p-3 text-charcoal-900 hover:bg-ivory-200 rounded-md transition-colors duration-200 font-medium"
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
                    className="block w-full text-center bg-gold hover:bg-gold-600 text-white font-semibold px-6 py-3 rounded-md transition-colors duration-300"
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
