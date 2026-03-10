"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";
import { Session } from "next-auth";

interface UserMenuProps {
  user: Session["user"];
}



export default function UserMenu({ user }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition"
      >
        <div className="relative w-8 h-8 rounded-full overflow-hidden">
          {user?.image ? (
            <Image
              src={user.image}
              alt="Profile"
              width={32}
              height={32}
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="w-full h-full bg-amber-500 text-black flex items-center justify-center font-semibold">
              {user?.name?.[0]?.toUpperCase() ?? "U"}
            </div>
          )}
        </div>

        <span className="text-sm">{user?.name ?? "User"}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-neutral-900 border border-white/10 rounded-xl shadow-lg overflow-hidden z-50">

          {user?.role === "USER" && (
            <>
              <Link href="/profile" className="block px-4 py-2 text-sm hover:bg-white/10">
                Profile
              </Link>
                <Link href="/favorites" className="block px-4 py-2 text-sm hover:bg-white/10">
                Favorites
              </Link>
               <Link href="/myproducts" className="block px-4 py-2 text-sm hover:bg-white/10">
                My Products
              </Link>
               <Link href="/stats" className="block px-4 py-2 text-sm hover:bg-white/10">
                Anaylystics
              </Link>
              <Link href="/dashboard" className="block px-4 py-2 text-sm hover:bg-white/10">
                Dashboard
              </Link>
               <Link href="/liked" className="block px-4 py-2 text-sm hover:bg-white/10">
                Liked
              </Link>
            </>
          )}

          {(user?.role === "ADMIN" || user?.role === "SUPERADMIN") && (
            <>
              <Link href="/admin/users" className="block px-4 py-2 text-sm hover:bg-white/10">
                Manage Users
              </Link>
              <Link href="/admin/categories" className="block px-4 py-2 text-sm hover:bg-white/10">
                Manage Categories
              </Link>
               <Link href="/admin/userproducts" className="block px-4 py-2 text-sm hover:bg-white/10">
                Manage Products 
              </Link>
                <Link href="/admin/published-products" className="block px-4 py-2 text-sm hover:bg-white/10">
                Published
              </Link>
            </>
          )}

          <div className="h-px bg-white/10 my-1" />

          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}