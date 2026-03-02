"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";

interface UserMenuProps {
  user: {
    name?: string | null;
    role?: string;
  };
}

export default function UserMenu({ user }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () =>
      document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition"
      >
        <div className="w-8 h-8 rounded-full bg-amber-500 text-black flex items-center justify-center font-semibold">
          {user.name?.[0]?.toUpperCase() ?? "U"}
        </div>

        <span className="text-sm">
          {user.name ?? "User"}
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-neutral-900 border border-white/10 rounded-xl shadow-lg overflow-hidden z-50">

          {/* USER LINKS */}
          {user?.role === "USER" && (
            <>
              <Link
                href="/profile"
                className="block px-4 py-2 text-sm hover:bg-white/10"
                onClick={() => setOpen(false)}
              >
                Profile
              </Link>

              <Link
                href="/dashboard"
                className="block px-4 py-2 text-sm hover:bg-white/10"
                onClick={() => setOpen(false)}
              >
                Dashboard
              </Link>
            </>
          )}

          {/* ADMIN LINKS */}
          {user?.role === "ADMIN" && (
            <>
              <Link
                href="/admin"
                className="block px-4 py-2 text-sm hover:bg-white/10"
                onClick={() => setOpen(false)}
              >
                Admin Dashboard
              </Link>

              <Link
                href="/admin/users"
                className="block px-4 py-2 text-sm hover:bg-white/10"
                onClick={() => setOpen(false)}
              >
                Manage Users
              </Link>
            </>
          )}

          <div className="h-px bg-white/10 my-1" />

          <button
            onClick={() => {
              signOut({ callbackUrl: "/" });
              setOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}