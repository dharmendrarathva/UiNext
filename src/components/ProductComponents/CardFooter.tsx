"use client";

import { useState } from "react";
import { FaEye, FaHeart, FaRegHeart, FaBookmark, FaRegBookmark } from "react-icons/fa";

interface Props {
  productId: string;
  views: number;
  likes: number;
  saves: number;
  initialLiked: boolean;
  initialSaved: boolean;
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
  initialLiked,
  initialSaved,
}: Props) {

  const [liked,setLiked] = useState(initialLiked);
  const [saved,setSaved] = useState(initialSaved);

  const [likesCount,setLikesCount] = useState(likes);
  const [savesCount,setSavesCount] = useState(saves);

  async function toggleLike(){

    const res = await fetch("/api/likes",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({productId})
    });

    const data = await res.json();

    setLiked(data.liked);
    setLikesCount(prev => data.liked ? prev+1 : prev-1);

  }

  async function toggleSave(){

    const res = await fetch("/api/favorites",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({productId})
    });

    const data = await res.json();

    setSaved(data.favorited);
    setSavesCount(prev => data.favorited ? prev+1 : prev-1);

  }

  return (

    <div className="mt-6 border border-neutral-700 rounded-2xl px-8 py-4 flex items-center justify-between text-lg bg-neutral-950">

      <div className="flex items-center gap-3 text-neutral-300">
        <FaEye size={22} className="text-neutral-400"/>
        <span>{format(views)}</span>
      </div>

      <button
        onClick={(e)=>{
          e.preventDefault();
          e.stopPropagation();
          toggleLike();
        }}
        className="flex items-center gap-3"
      >

        {liked
          ? <FaHeart size={22} className="text-red-500"/>
          : <FaRegHeart size={22} className="text-neutral-400 hover:text-red-400 transition"/>
        }

        <span className={liked ? "text-red-400" : "text-neutral-300"}>
          {format(likesCount)}
        </span>

      </button>

      <button
        onClick={(e)=>{
          e.preventDefault();
          e.stopPropagation();
          toggleSave();
        }}
        className="flex items-center gap-3"
      >

        {saved
          ? <FaBookmark size={22} className="text-yellow-400"/>
          : <FaRegBookmark size={22} className="text-neutral-400 hover:text-yellow-300 transition"/>
        }

        <span className={saved ? "text-yellow-300" : "text-neutral-300"}>
          {format(savesCount)}
        </span>

      </button>

    </div>

  );

}