"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  slug: string;
  thumbnail?: string;

  likesCount?: number;
  favoritesCount?: number;
  viewsCount?: number;

  createdBy?: {
    username: string;
  };
}
const PRODUCTS_PER_PAGE = 16;

export default function AllProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(PRODUCTS_PER_PAGE);
  const [likes, setLikes] = useState<string[]>([]);
  

  ////////////////////////////////////////////////////
  // LOAD PRODUCTS
  ////////////////////////////////////////////////////

  async function loadProducts() {
    try {
      const res = await fetch("/api/products");
      if (!res.ok) return;
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  }

  ////////////////////////////////////////////////////
  // LOAD FAVORITES
  ////////////////////////////////////////////////////

  async function loadFavorites() {
    try {
      const res = await fetch("/api/favorites");
      if (!res.ok) return;

      const data = await res.json();

      const ids = data.map((f: any) => f.product._id);

      setFavorites(ids);
    } catch (err) {
      console.error(err);
    }
  }

  async function loadLikes() {
  try {
    const res = await fetch("/api/likes");
    if (!res.ok) return;

    const data = await res.json();

    const ids = data.map((l: any) => l.product._id);

    setLikes(ids);
  } catch (err) {
    console.error(err);
  }
}



  ////////////////////////////////////////////////////
  // TOGGLE FAVORITE
  ////////////////////////////////////////////////////

  async function toggleFavorite(productId: string) {
    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      });

      if (!res.ok) return;

      const data = await res.json();

      if (data.favorited) {
        setFavorites((prev) => [...prev, productId]);
      } else {
        setFavorites((prev) => prev.filter((id) => id !== productId));
      }
    } catch (err) {
      console.error(err);
    }
  }
  function formatViews(num: number) {

if (num >= 1000000) {
return (num / 1000000).toFixed(1) + "M";
}

if (num >= 1000) {
return (num / 1000).toFixed(1) + "k";
}

return num;

}

  async function toggleLike(productId: string) {
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

    if (data.liked) {
      setLikes((prev) => [...prev, productId]);
    } else {
      setLikes((prev) => prev.filter((id) => id !== productId));
    }
  } catch (err) {
    console.error(err);
  }
}

  ////////////////////////////////////////////////////
  // INIT
  ////////////////////////////////////////////////////

useEffect(() => {
  loadProducts();
  loadFavorites();
  loadLikes();
}, []);

  const visibleProducts = products.slice(0, visibleCount);
  const hasMore = visibleCount < products.length;
  

  ////////////////////////////////////////////////////
  // UI
  ////////////////////////////////////////////////////

  return (
    <div className="min-h-screen bg-neutral-950 px-6 md:px-16 py-12 text-white">

      {/* Heading */}
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold">
          Explore Marketplace
        </h1>
        <p className="text-neutral-400 mt-2">
          Discover premium 3D models crafted by talented creators.
        </p>
      </div>

      {/* Grid */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visibleProducts.map((p) => {
          const isSaved = favorites.includes(p._id);
          const isLiked = likes.includes(p._id);

          return (
            <Link
              key={p._id}
              href={`/components/${p.createdBy?.username}/${p.slug}`}
              className="group"
            >
              <div className="bg-neutral-950 rounded-2xl overflow-hidden border border-neutral-700 hover:border-neutral-600 transition-all duration-300 shadow-lg hover:shadow-neutral-500/10">

                {/* Image */}
                <div className="relative h-52 overflow-hidden">

                  {/* Save Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleFavorite(p._id);
                    }}
                    className={`absolute top-3 right-3 z-10 px-3 py-1 text-xs rounded-lg backdrop-blur border transition
                    ${
                      isSaved
                        ? "bg-yellow-500 text-black border-yellow-400"
                        : "bg-black/60 text-white border-neutral-700 hover:bg-black/80"
                    }`}
                  >
                    {isSaved ? "Saved" : "Save"}
                  </button>

       

                  {p.thumbnail ? (
                    <img
                      src={p.thumbnail}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
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

                  <p className="text-sm text-slate-400 mt-2 line-clamp-2">
                    {p.description}
                  </p>

               <div className="flex items-center justify-between mt-5">

<span className="text-blue-400 font-bold text-lg">
₹{p.price}
</span>

<span className="text-xs text-slate-500">
@{p.createdBy?.username}
</span>

</div>

{/* Interaction Footer */}

<div className="flex items-center justify-between mt-4 text-xs text-neutral-400 border-t border-neutral-800 pt-3">

<span>❤️ {p.likesCount ?? 0}</span>

<span>⭐ {p.favoritesCount ?? 0}</span>

<span>👁 {formatViews(p.viewsCount ?? 0)}</span>

</div>
                </div>

                           <button
  onClick={(e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleLike(p._id);
  }}
  className={`absolute top-3 left-3 px-3 py-1 text-xs rounded-lg backdrop-blur border
  ${
    isLiked
      ? "bg-red-500 text-white border-red-400"
      : "bg-black/60 text-white border-neutral-700"
  }`}
>
  {isLiked ? "Liked" : "Like"}
</button>

              </div>
            </Link>
          );
        })}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="flex justify-center mt-12">
          <button
            onClick={() => setVisibleCount((prev) => prev + PRODUCTS_PER_PAGE)}
            className="px-8 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 transition-all duration-300 font-medium"
          >
            Load More
          </button>
        </div>
      )}

      {!hasMore && products.length > 0 && (
        <p className="text-center text-neutral-500 mt-10">
          You’ve reached the end.
        </p>
      )}
    </div>
  );
}