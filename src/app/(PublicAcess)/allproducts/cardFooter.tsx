"use client";

import { FaEye } from "react-icons/fa";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";

interface Props {
  productId: string;
  views: number;
  likes: number;
  saves: number;
  liked: boolean;
  saved: boolean;
  onLike: (id: string) => void;
  onSave: (id: string) => void;
}

function format(num: number) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "k";
  return num;
}

export default function CardFooter({
  productId,
  views,
  likes,
  saves,
  liked,
  saved,
  onLike,
  onSave,
}: Props) {
  return (
    <div className="mt-6 border border-neutral-700 rounded-2xl px-8 py-4 flex items-center justify-between text-lg bg-neutral-950">

      {/* Views */}
      <div className="flex items-center gap-3 text-neutral-300">
        <FaEye size={22} className="text-neutral-400" />
        <span>{format(views)}</span>
      </div>

      {/* Likes */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onLike(productId);
        }}
        className="flex items-center gap-3"
      >
        {liked ? (
          <FaHeart size={22} className="text-red-500" />
        ) : (
          <FaRegHeart size={22} className="text-neutral-400 hover:text-red-400 transition" />
        )}
        <span className={liked ? "text-red-400" : "text-neutral-300"}>
          {format(likes)}
        </span>
      </button>

      {/* Saves */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onSave(productId);
        }}
        className="flex items-center gap-3"
      >
        {saved ? (
          <FaBookmark size={22} className="text-yellow-400" />
        ) : (
          <FaRegBookmark size={22} className="text-neutral-400 hover:text-yellow-300 transition" />
        )}
        <span className={saved ? "text-yellow-300" : "text-neutral-300"}>
          {format(saves)}
        </span>
      </button>

    </div>
  );
}