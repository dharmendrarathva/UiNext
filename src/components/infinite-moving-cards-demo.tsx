"use client";

import React from "react";
import Link from "next/link";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";

interface UserItem {
  _id: string;
  username: string;
  image: string | null;
  name: string;
}

export default function InfiniteMovingCardsDemo({
  users,
}: {
  users: UserItem[];
}) {

 const items = users.map((user) => ({
  id: user._id,
  quote: user.image ?? "",
  name: user.name,
  title: `@${user.username}`,
}));

  return (
    <div className="w-full overflow-hidden py-6">
     <div className="container mx-auto px-4 mb-12 flex justify-center">
  <h2 className="relative text-4xl font-bold text-white uppercase tracking-widest drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
    <span className="relative z-10">Creators Who Dominate</span>
    {/* Underlying neon glow effect */}
    <span className="absolute -inset-1 blur-md bg-amber-500/20 -z-10 rounded-full"></span>
  </h2>
</div>

      <InfiniteMovingCards
        items={items}
        direction="right"
        speed="slow"
      />
    </div>
  );
}