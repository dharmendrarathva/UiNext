"use client";

import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { IoCloseOutline } from "react-icons/io5";


export default function LoginPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const mode =
    searchParams.get("mode") === "register" ? "register" : "login";

  return (
    <div className="relative w-full max-w-md bg-neutral-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-10 shadow-[0_40px_120px_rgba(0,0,0,0.8)]">

      {/* Close Button */}
      <button
        onClick={() => router.push("/")}
        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full  hover:bg-white/10 text-neutral-400 hover:text-white transition"
        aria-label="Close"
      >
<IoCloseOutline size={25} />
      </button>

      {/* Logo */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-white">
          UiSnap
        </h1>
      </div>

      {/* Heading */}
      <h2 className="text-xl font-medium text-center text-white mb-2">
        {mode === "login" ? "Welcome back" : "Create your account"}
      </h2>

      <p className="text-sm text-neutral-400 text-center mb-8">
        {mode === "login"
          ? "Sign in to continue"
          : "Join and start building"}
      </p>

      {/* Google Button */}
    <button
  onClick={() =>
    signIn("google", { callbackUrl: "/" })
  }
  className="w-full flex items-center justify-center gap-3 bg-white text-black font-medium py-3 rounded-lg hover:bg-neutral-100 active:scale-[0.99] transition-all duration-200 shadow-lg"
>
  {/* Official Google Logo */}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    width="20"
    height="20"
  >
    <path
      fill="#EA4335"
      d="M24 9.5c3.54 0 6.74 1.22 9.25 3.6l6.9-6.9C35.9 2.2 30.3 0 24 0 14.64 0 6.62 5.48 2.76 13.44l8.06 6.26C12.68 13.14 17.9 9.5 24 9.5z"
    />
    <path
      fill="#4285F4"
      d="M46.14 24.5c0-1.64-.15-3.22-.43-4.74H24v9h12.44c-.54 2.9-2.16 5.35-4.6 7.02l7.17 5.58C43.98 36.7 46.14 31.1 46.14 24.5z"
    />
    <path
      fill="#FBBC05"
      d="M10.82 28.7a14.5 14.5 0 010-9.4l-8.06-6.26A23.97 23.97 0 000 24c0 3.86.92 7.5 2.76 10.56l8.06-6.26z"
    />
    <path
      fill="#34A853"
      d="M24 48c6.3 0 11.9-2.08 15.87-5.66l-7.17-5.58c-2 1.34-4.56 2.14-8.7 2.14-6.1 0-11.32-3.64-13.18-8.2l-8.06 6.26C6.62 42.52 14.64 48 24 48z"
    />
  </svg>

  <span>
    {mode === "login"
      ? "Continue with Google"
      : "Sign up with Google"}
  </span>
</button>

      {/* Divider */}
      <div className="flex items-center my-8">
        <div className="flex-1 h-px bg-white/10" />
        <span className="px-4 text-xs text-neutral-500 uppercase tracking-wider">
          Or
        </span>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      {/* Switch Mode */}
      <div className="text-center text-sm text-neutral-400">
        {mode === "login" ? (
          <>
            Don’t have an account?{" "}
            <Link
              href="/login?mode=register"
              className="text-amber-500 hover:text-amber-400 font-medium transition"
            >
              Sign up
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link
              href="/login?mode=login"
              className="text-amber-500 hover:text-amber-400 font-medium transition"
            >
              Log in
            </Link>
          </>
        )}
      </div>

      {/* Terms */}
      <p className="text-center text-xs text-neutral-600 mt-8">
        By continuing, you agree to our Terms and Privacy Policy.
      </p>
    </div>
  );
}