"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

interface Props {
  targetUserId: string;
  initialIsFollowing: boolean;
}

export default function FollowButton({
  targetUserId,
  initialIsFollowing,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);

  const handleClick = () => {
    startTransition(async () => {
      await fetch("/api/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId }),
      });

      setIsFollowing((prev) => !prev);
      router.refresh();
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="px-4 py-2 bg-yellow-500 text-black rounded-lg"
    >
      {isPending ? "Processing..." : isFollowing ? "Following" : "Follow"}
    </button>
  );
}