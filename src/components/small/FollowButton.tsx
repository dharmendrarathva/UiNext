"use client";

import { useState, useTransition } from "react";

interface Props {
  targetUserId: string;
  initialIsFollowing: boolean;
  onFollowChange: (isFollowing: boolean) => void;
}

export default function FollowButton({
  targetUserId,
  initialIsFollowing,
  onFollowChange,
}: Props) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isPending, startTransition] = useTransition();
  const [hover, setHover] = useState(false);

  const handleClick = () => {
    const optimisticState = !isFollowing;

    // optimistic update
    setIsFollowing(optimisticState);
    onFollowChange(optimisticState);

    startTransition(async () => {
      try {
        await fetch("/api/follow", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ targetUserId }),
        });
      } catch {
        // revert if API fails
        setIsFollowing(!optimisticState);
        onFollowChange(!optimisticState);
      }
    });
  };

  const label = isFollowing
    ? hover
      ? "Unfollow"
      : "Following"
    : "Follow";

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`px-5 py-2 rounded-lg font-medium transition
        ${
          isFollowing
            ? hover
              ? "bg-red-500 text-white"
              : "bg-neutral-800 text-white border border-neutral-700"
            : "bg-yellow-500 text-black hover:bg-yellow-400"
        }`}
    >
      {isPending ? "Processing..." : label}
    </button>
  );
}