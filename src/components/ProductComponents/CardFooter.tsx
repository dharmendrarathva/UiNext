"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaEye, FaHeart, FaRegHeart, FaBookmark, FaRegBookmark } from "react-icons/fa";
import Loader from "./Loader";

interface Props {
  productId: string;
  views: number;
  likes: number;
  saves: number;
  initialLiked: boolean;
  initialSaved: boolean;
}

function format(num: number) {
  if (!Number.isFinite(num)) return "0";

  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "k";

  return num.toString();
}

export default function CardFooter({
  productId,
  views,
  likes,
  saves,
  initialLiked,
  initialSaved,
}: Props) {

  const { data: session } = useSession();
  const router = useRouter();

  const [liked, setLiked] = useState(initialLiked);
  const [saved, setSaved] = useState(initialSaved);

  const [likesCount, setLikesCount] = useState(likes || 0);
  const [savesCount, setSavesCount] = useState(saves || 0);

  const [likeLoading, setLikeLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  //////////////////////////////////////////////////////
  // DEBUG INFO
  //////////////////////////////////////////////////////

  console.log("Product:", productId);
  console.log("Liked:", liked, "LikesCount:", likesCount);
  console.log("Saved:", saved, "SavesCount:", savesCount);

  //////////////////////////////////////////////////////
  // LOGIN REDIRECT
  //////////////////////////////////////////////////////

  function requireLogin() {

    const callback = window.location.pathname;

    console.log("User not logged in → redirecting");

    router.push(
      `/login?mode=login&callbackUrl=${encodeURIComponent(callback)}`
    );
  }

  //////////////////////////////////////////////////////
  // TOGGLE LIKE
  //////////////////////////////////////////////////////

  async function toggleLike() {

    if (likeLoading) return;

    if (!session) {
      requireLogin();
      return;
    }

    try {

      setLikeLoading(true);

      console.log("Sending LIKE request for:", productId);

      const res = await fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      const data = await res.json();

      console.log("LIKE response:", data);

      setLiked(Boolean(data.liked));
      setLikesCount(Number.isFinite(data.likesCount) ? data.likesCount : 0);

    } catch (err) {

      console.error("LIKE error:", err);

    } finally {

      setLikeLoading(false);

    }

  }

  //////////////////////////////////////////////////////
  // TOGGLE SAVE
  //////////////////////////////////////////////////////

  async function toggleSave() {

    if (saveLoading) return;

    if (!session) {
      requireLogin();
      return;
    }

    try {

      setSaveLoading(true);

      console.log("Sending FAVORITE request for:", productId);

      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      const data = await res.json();

      console.log("FAVORITE response:", data);

      setSaved(Boolean(data.favorited));
      setSavesCount(Number.isFinite(data.favoritesCount) ? data.favoritesCount : 0);

    } catch (err) {

      console.error("FAVORITE error:", err);

    } finally {

      setSaveLoading(false);

    }

  }

  //////////////////////////////////////////////////////
  // UI
  //////////////////////////////////////////////////////

  return (

    <div className="mt-6 border border-neutral-700 rounded-2xl px-8 py-4 flex items-center justify-between text-lg bg-neutral-950">

      <div className="flex items-center gap-3 text-neutral-300">
        <FaEye size={22} className="text-neutral-400" />
        <span>{format(views)}</span>
      </div>

<button
  onClick={(e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleLike();
  }}
  className="flex items-center gap-3"
>
  {likeLoading ? (
    <Loader />
  ) : liked ? (
    <FaHeart size={22} className="text-red-500" />
  ) : (
    <FaRegHeart size={22} className="text-neutral-400 hover:text-red-400 transition" />
  )}

  <span className={liked ? "text-red-400" : "text-neutral-300"}>
    {format(likesCount)}
  </span>
</button>





  <button
  onClick={(e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSave();
  }}
  className="flex items-center gap-3"
>
  {saveLoading ? (
    <Loader />
  ) : saved ? (
    <FaBookmark size={22} className="text-yellow-400" />
  ) : (
    <FaRegBookmark size={22} className="text-neutral-400 hover:text-yellow-300 transition" />
  )}

  <span className={saved ? "text-yellow-300" : "text-neutral-300"}>
    {format(savesCount)}
  </span>
</button>

    </div>

  );
}