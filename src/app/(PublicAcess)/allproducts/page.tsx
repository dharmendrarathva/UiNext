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
  createdBy?: {
    username: string;
  };
}

const PRODUCTS_PER_PAGE = 16;

export default function AllProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [visibleCount, setVisibleCount] = useState(PRODUCTS_PER_PAGE);

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

  useEffect(() => {
    loadProducts();
  }, []);

  const visibleProducts = products.slice(0, visibleCount);
  const hasMore = visibleCount < products.length;

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
        {visibleProducts.map((p) => (
          <Link
            key={p._id}
            href={`/components/${p.createdBy?.username}/${p.slug}`}
            className="group"
          >
            <div className="bg-neutral-950 rounded-2xl overflow-hidden border border-neutral-700 hover:border-neutral-600 transition-all duration-300 shadow-lg hover:shadow-neutral-500/10">

              <div className="relative h-52 overflow-hidden">
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
              </div>

            </div>
          </Link>
        ))}
      </div>

      {/* Load More Button */}
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