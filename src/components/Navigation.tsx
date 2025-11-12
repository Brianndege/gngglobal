"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export default function Navigation() {
  return (
    <nav className="bg-white border-b sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-[#293d7c] tracking-tight">
                GNG <span className="font-normal">GLOBAL</span>
              </div>
            </div>
            <div className="hidden sm:block text-sm text-gray-500 border-l pl-3 ml-3">Investment Group</div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-sm font-medium text-gray-900 hover:text-[#293d7c] transition-colors">Home</Link>
            <Link href="/about" className="text-sm font-medium text-gray-600 hover:text-[#293d7c] transition-colors">About</Link>
            <Link href="/portfolio" className="text-sm font-medium text-gray-600 hover:text-[#293d7c] transition-colors">Portfolio</Link>
            <Link href="/news" className="text-sm font-medium text-gray-600 hover:text-[#293d7c] transition-colors">News and Media</Link>
            <Link href="/team" className="text-sm font-medium text-gray-600 hover:text-[#293d7c] transition-colors">Team</Link>
            <Link href="/contact" className="text-sm font-medium text-gray-600 hover:text-[#293d7c] transition-colors">Contact</Link>
          </div>

          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <div className="flex flex-col space-y-6 mt-8">
                <Link href="/" className="text-lg font-medium text-gray-900 hover:text-[#293d7c] transition-colors">
                  Home
                </Link>
                <Link href="/about" className="text-lg font-medium text-gray-600 hover:text-[#293d7c] transition-colors">
                  About
                </Link>
                <Link href="/portfolio" className="text-lg font-medium text-gray-600 hover:text-[#293d7c] transition-colors">
                  Portfolio
                </Link>
                <Link href="/news" className="text-lg font-medium text-gray-600 hover:text-[#293d7c] transition-colors">
                  News and Media
                </Link>
                <Link href="/team" className="text-lg font-medium text-gray-600 hover:text-[#293d7c] transition-colors">
                  Team
                </Link>
                <Link href="/contact" className="text-lg font-medium text-gray-600 hover:text-[#293d7c] transition-colors">
                  Contact
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
