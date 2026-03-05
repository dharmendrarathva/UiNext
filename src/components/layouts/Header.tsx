"use client";

import Link from "next/link";
import { Session } from "next-auth";
import { FaShoppingCart } from "react-icons/fa";
import UserMenu from "@/components/layouts/UserMenu";

interface HeaderProps {
  session: Session | null;
}

export default function Header({ session }: HeaderProps) {
  return (
    <header className="sticky top-0 z-80 w-full border-b border-white/10 bg-white/5 backdrop-blur-xs">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="text-2xl font-semibold">
          UiSnap<span className="text-amber-500">.com</span>
        </Link>

        <div className="flex items-center gap-8">

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-sm text-neutral-400">
             <Link href="/allproducts" className="hover:text-white transition">
              Components
            </Link>
            <Link href="/blog" className="hover:text-white transition">
              Blog
            </Link>

            <Link href="/careers" className="hover:text-white transition">
              Careers
            </Link>

            <Link href="/about" className="hover:text-white transition">
              About
            </Link>

            <Link href="/contact" className="hover:text-white transition">
              Contact
            </Link>

            <Link href="/license" className="hover:text-white transition">
              License
            </Link>
          </nav>

          {/* Right Section */}
          {!session ? (
            <div className="flex items-center gap-3">
              <Link
                href="/login?mode=login"
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition"
              >
                Login
              </Link>

              <Link
                href="/login?mode=register"
                className="px-4 py-2 bg-amber-500 text-black rounded-lg hover:bg-amber-400 transition"
              >
                Register
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-5">

              {/* Cart Icon */}
              <Link
                href="/mycart"
                className="text-neutral-400 hover:text-white transition text-lg"
              >
                <FaShoppingCart />
              </Link>

              {/* User Menu */}
              <UserMenu user={session.user} />

            </div>
          )}

        </div>
      </div>
    </header>
  );
}