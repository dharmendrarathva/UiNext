"use client";

import { useState, useTransition } from "react";
import ConfirmModal from "@/components/small/ConfirmModal";

interface Props {
  targetUserId: string;
  profileName: string;
  initialIsFollowing: boolean;
  onFollowChange: (isFollowing: boolean) => void;
}

export default function FollowButton({
  targetUserId,
  profileName,
  initialIsFollowing,
  onFollowChange,
}: Props) {

  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);

  function followAction() {
    const optimisticState = !isFollowing;

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
        setIsFollowing(!optimisticState);
        onFollowChange(!optimisticState);
      }
    });
  }

  function handleClick() {
    if (isFollowing) {
      setShowConfirm(true);
    } else {
      followAction();
    }
  }

  function confirmUnfollow() {
    setShowConfirm(false);
    followAction();
  }

  return (
    <>
      <button
        onClick={handleClick}
        disabled={isPending}
        className={`px-5 py-2 rounded-lg font-medium transition
          ${
            isFollowing
              ? "bg-neutral-800 border border-neutral-700 text-white hover:bg-neutral-700"
              : "bg-yellow-500 text-black hover:bg-yellow-400"
          }`}
      >
        {isPending ? "Processing..." : isFollowing ? "Following" : "Follow"}
      </button>

      <ConfirmModal
        open={showConfirm}
        title="Unfollow User"
        message={`Are you sure you want to unfollow ${profileName}?`}
        confirmText="Unfollow"
        cancelText="Cancel"
        onConfirm={confirmUnfollow}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}