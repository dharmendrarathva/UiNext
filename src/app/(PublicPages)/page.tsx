"use client";

import { useState } from "react";
import Link from "next/link";

import { FlipWords } from "@/components/ui/FlipWords";
import { GridBackgroundDemo } from "@/components/ui/GridBackgroundDemo";

export default function Home() {
  const [categories] = useState<string[]>([]);
  const [loading] = useState<boolean>(true);

  const words: string[] = [
    "faster",
    "smarter",
    "beautiful",
    "insane",
    "next-gen",
    "pixel-perfect",
    "future-ready",
    "minimal",
    "modern",
    "elegant",
  ];

  return (
<main className="relative min-h-screen w-full">      {/* Background Grid */}
      <div className="absolute inset-0 -z-10">
        <GridBackgroundDemo />
      </div>

      {/* Content Layer */}
      <div className="  flex flex-col items-center pt-32 pb-20 px-6">
<div className="relative text-6xl font-extrabold text-neutral-200 leading-[1.05]">
  <div className="flex gap-0 items-baseline relative">
    <span className="mt-1.5">Build</span>

    <span className="absolute left-[4.5ch]">
      <FlipWords words={words} className="text-amber-600" />
    </span>
  </div>

  <div className="mt-2.5">
    websites with <span className="text-white">UiSnap</span>
  </div>
</div>

        <p className="mt-6 text-lg text-neutral-400 text-center max-w-2xl">
          Stunning UI components crafted for developers who care about design
          and performance.
        </p>

        <div className="relative w-full max-w-5xl mx-auto h-10 overflow-hidden mt-2 mb-40">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-neutral-400/80 to-transparent" />

          <div className="absolute top-0 translate-y-1/2 left-0 h-[3px] w-1 bg-white shadow-[0_0_10px_2px_rgba(255,255,255,0.9)] animate-sweep-contained" />
        </div>
      </div>
    </main>
  );
}