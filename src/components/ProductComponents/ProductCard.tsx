"use client";

import Link from "next/link";
import CardFooter from "./CardFooter";
import { Product } from "@/types/Product";

export default function ProductCard({ product }: { product: Product }) {

  return (

    <Link
      href={`/components/${product.createdBy?.username}/${product.slug}`}
      className="group"
    >

      <div className="bg-neutral-950 rounded-2xl overflow-hidden border border-neutral-700 hover:border-neutral-600 transition shadow-lg flex flex-col">

        {/* IMAGE */}

        <div className="h-52 bg-neutral-900 flex items-center justify-center overflow-hidden">

          {product.thumbnail ? (

            <img
              src={product.thumbnail}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-110 transition"
            />

          ) : (

            <span className="text-neutral-500">
              No Image
            </span>

          )}

        </div>

        {/* CONTENT */}

        <div className="p-5 flex flex-col flex-1">

          <h3 className="font-semibold text-lg line-clamp-1">
            {product.title}
          </h3>

          {product.description && (
            <p className="text-sm text-neutral-400 mt-2 line-clamp-2">
              {product.description}
            </p>
          )}

          <div className="flex justify-between mt-4">

            <span className="text-blue-400 font-bold">
              ₹{product.price}
            </span>

            <span className="text-xs text-neutral-500">
              @{product.createdBy?.username}
            </span>

          </div>

          {/* FOOTER */}

          <CardFooter
            productId={product._id}
            views={product.viewsCount ?? 0}
            likes={product.likesCount ?? 0}
            saves={product.favoritesCount ?? 0}
            initialLiked={product.liked ?? false}
            initialSaved={product.saved ?? false}
          />

        </div>

      </div>

    </Link>

  );

}