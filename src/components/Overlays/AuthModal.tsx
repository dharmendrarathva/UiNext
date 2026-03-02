"use client";

import { signIn } from "next-auth/react";
import { useEffect } from "react";

interface AuthModalProps {
  type: "login" | "register";
  onClose: () => void;
}

export default function AuthModal({ type, onClose }: AuthModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[10] flex items-center justify-center  backdrop-blur-xs p-6">

      <div className="relative w-full max-w-4xl bg-neutral-950 border border-white/10 rounded-3xl overflow-hidden shadow-2xl grid md:grid-cols-2">

        <div className="hidden md:flex flex-col justify-center p-12 bg-gradient-to-br from-neutral-800 to-neutral-600 ">
          <h2 className="text-4xl font-bold mb-6 text-white">
            {type === "login" ? "Welcome Back" : "Join UiSnap"}
          </h2>

          <p className="text-lg opacity-90 leading-relaxed text-white/50">
            {type === "login"
              ? "Access your dashboard, manage your content, and continue building amazing UI blocks."
              : "Create your account instantly and start building, sharing, and exploring UI components."}
          </p>

          <div className="mt-10 text-sm opacity-80">
           Quick. Fast. Secure.
          </div>
        </div>

        <div className="relative p-10 flex flex-col justify-center">

          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-neutral-500 hover:text-white transition"
          >
            ✕
          </button>

          <h3 className="text-3xl font-semibold mb-3">
            {type === "login" ? "Sign In" : "Create Account"}
          </h3>

          <p className="text-neutral-400 mb-8">
            {type === "login"
              ? "Sign in using your Google account."
              : "Register using your Google account."}
          </p>

          <button
            onClick={() =>
              signIn("google", {
                callbackUrl: "/dashboard",
              })
            }
            className="w-full flex items-center justify-center gap-3 bg-white text-black font-semibold py-4 rounded-xl hover:bg-neutral-200 transition text-lg"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="google"
              className="w-6 h-6"
            />
            Continue with Google
          </button>

          <div className="mt-10 text-xs text-neutral-500 text-center">
            By continuing, you agree to our Terms & Privacy Policy.
          </div>

        </div>

      </div>
    </div>
  );
}