"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";
import UserMenu from "@/components/layouts/UserMenu";
import AuthModal from "@/components/Overlays/AuthModal";

export default function Header() {
  const { data: session } = useSession();
  const [authType, setAuthType] = useState<"login" | "register" | null>(null);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-white/5 backdrop-blur-sm text-white">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

          <Link
            href="/"
            className="text-2xl font-semibold tracking-tight text-white"
          >
            UiSnap<span className="text-amber-500">.com</span>
          </Link>

          <div className="flex items-center gap-4">

            {!session && (
              <>
                <button
                  onClick={() => setAuthType("login")}
                  className="px-4 py-2 text-sm bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg transition"
                >
                  Login
                </button>

                <button
                  onClick={() => setAuthType("register")}
                  className="px-4 py-2 text-sm bg-amber-500 hover:bg-amber-400 rounded-lg text-black font-semibold transition"
                >
                  Register
                </button>
              </>
            )}

            {session && <UserMenu user={session.user} />}

          </div>
        </div>
      </header>

      {/* Modal */}
      {authType && (
        <AuthModal
          type={authType}
          onClose={() => setAuthType(null)}
        />
      )}
    </>
  );
}