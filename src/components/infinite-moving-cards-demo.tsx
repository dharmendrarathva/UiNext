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
    <div className="w-full overflow-hidden py-16">

      <InfiniteMovingCards
        items={items}
        direction="right"
        speed="normal"
      />

    </div>
  );
}