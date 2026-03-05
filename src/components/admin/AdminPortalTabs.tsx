"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/admin/dashboard", label: "Dashboard", match: (path: string) => path === "/admin/dashboard" },
  { href: "/admin/posts", label: "Posts", match: (path: string) => path.startsWith("/admin/posts") },
  { href: "/admin/messages", label: "Messages", match: (path: string) => path === "/admin/messages" },
  { href: "/admin/subscribers", label: "Subscribers", match: (path: string) => path === "/admin/subscribers" },
  { href: "/admin/guide", label: "Guide", match: (path: string) => path === "/admin/guide" },
];

export default function AdminPortalTabs() {
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return null;
  }

  return (
    <div className="px-4 md:px-6 pt-3">
      <nav className="mx-auto max-w-6xl rounded-lg border border-ivory-300 bg-white p-2">
        <ul className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const active = tab.match(pathname);

            return (
              <li key={tab.href}>
                <Link
                  href={tab.href}
                  className={`inline-flex rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    active
                      ? "bg-navy-700 text-white"
                      : "border border-charcoal-300 text-charcoal-700 hover:border-navy-500 hover:text-navy-800"
                  }`}
                >
                  {tab.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
