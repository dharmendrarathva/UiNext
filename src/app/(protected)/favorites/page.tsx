"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductComponents/ProductCard";
import { Product } from "@/types/Product";

interface FavoriteItem {
  _id: string;
  product: Product | null;
}

export default function FavoritesPage() {

  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);

  ////////////////////////////////////////////////////
  // LOAD FAVORITES
  ////////////////////////////////////////////////////

  async function loadFavorites() {

    try {

      const res = await fetch("/api/favorites");

      if (!res.ok) return;

      const data = await res.json();

      // remove deleted products
      const filtered = data.filter((f: FavoriteItem) => f.product);

      setFavorites(filtered);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }

  }

  ////////////////////////////////////////////////////
  // INIT
  ////////////////////////////////////////////////////

  useEffect(() => {
    loadFavorites();
  }, []);

  ////////////////////////////////////////////////////
  // LOADING
  ////////////////////////////////////////////////////

  if (loading) {

    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-neutral-400">
        Loading favorites...
      </div>
    );

  }

  ////////////////////////////////////////////////////
  // EMPTY STATE
  ////////////////////////////////////////////////////

  if (favorites.length === 0) {

    return (

      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-950 text-center text-white">

        <h2 className="text-2xl font-semibold">
          No saved products
        </h2>

        <p className="text-neutral-400 mt-2">
          Save products to see them here.
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
        Your Saved Products
      </h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

        {favorites.map((f) => (

          <ProductCard
            key={f._id}
            product={f.product!}
          />

        ))}

      </div>

    </div>

  );

}