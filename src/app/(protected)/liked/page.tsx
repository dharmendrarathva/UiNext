"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface LikedProduct {
  _id: string;
  product: {
    _id: string;
    title: string;
    slug: string;
    price: number;
    thumbnail?: string;
    createdBy?: {
      username: string;
    };
  };
}

export default function LikedPage() {
  const [likes, setLikes] = useState<LikedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  ////////////////////////////////////////////////////
  // LOAD LIKED PRODUCTS
  ////////////////////////////////////////////////////

  async function loadLikes() {
    try {
      const res = await fetch("/api/likes");

      if (!res.ok) return;

      const data = await res.json();

      setLikes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  ////////////////////////////////////////////////////
  // REMOVE LIKE
  ////////////////////////////////////////////////////

  async function removeLike(productId: string) {
    try {
      const res = await fetch("/api/likes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      });

      if (!res.ok) return;

      const data = await res.json();

      if (!data.liked) {
        setLikes((prev) =>
          prev.filter((l) => l.product._id !== productId)
        );
      }
    } catch (err) {
      console.error(err);
    }
  }

  ////////////////////////////////////////////////////
  // INIT
  ////////////////////////////////////////////////////

  useEffect(() => {
    loadLikes();
  }, []);

  ////////////////////////////////////////////////////
  // LOADING
  ////////////////////////////////////////////////////

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white">
        Loading liked products...
      </div>
    );
  }

  ////////////////////////////////////////////////////
  // EMPTY STATE
  ////////////////////////////////////////////////////

  if (likes.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-950 text-white">
        <h2 className="text-2xl font-semibold">No liked products</h2>
        <p className="text-neutral-400 mt-2">
          Like products to see them here.
        </p>
      </div>
    );
  }

  ////////////////////////////////////////////////////
  // UI
  ////////////////////////////////////////////////////

  return (
    <div className="min-h-screen bg-neutral-950 px-6 md:px-16 py-12 text-white">

      <h1 className="text-3xl font-bold mb-10">
        Liked Products
      </h1>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {likes.map((l) => {
          const p = l.product;

          return (
            <Link
              key={p._id}
              href={`/components/${p.createdBy?.username}/${p.slug}`}
              className="group"
            >
              <div className="bg-neutral-950 rounded-2xl overflow-hidden border border-neutral-700 hover:border-neutral-600 transition-all duration-300">

                {/* Image */}
                <div className="relative h-52 overflow-hidden">

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      removeLike(p._id);
                    }}
                    className="absolute top-3 right-3 px-3 py-1 text-xs rounded-lg bg-red-500 text-white"
                  >
                    Liked
                  </button>

                  {p.thumbnail ? (
                    <img
                      src={p.thumbnail}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-neutral-900 text-slate-500">
                      No Image
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-semibold text-lg line-clamp-1">
                    {p.title}
                  </h3>

                  <div className="flex items-center justify-between mt-4">
                    <span className="text-blue-400 font-bold">
                      ₹{p.price}
                    </span>

                    <span className="text-xs text-neutral-500">
                      @{p.createdBy?.username}
                    </span>
                  </div>
                </div>

              </div>
            </Link>
          );
        })}
      </div>

    </div>
  );
}