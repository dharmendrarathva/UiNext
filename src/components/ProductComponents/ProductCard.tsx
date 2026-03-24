"use client";

import Link from "next/link";
import CardFooter from "./CardFooter";
import { Product } from "@/types/Product";
import MiniPreview from "../ProductDisplay/MiniPreview";

export default function ProductCard({ product }: { product: Product }) {

  return (

    <Link
      href={`/components/${product.createdBy?.username}/${product.slug}`}
      className="group"
    >

      <div className="bg-neutral-950 rounded-2xl overflow-hidden border border-neutral-700 hover:border-neutral-600 transition shadow-lg flex flex-col">

        {/* MINI PREVIEW */}

        <div className="bg-neutral-900 border-b border-neutral-800">

          <MiniPreview codes={product.codes} />

        </div>

        {/* CONTENT */}

        <div className="p-5 flex flex-col flex-1">

          <h3 className="font-semibold text-lg line-clamp-1">
            {product.title}
          </h3>

          <div className="flex justify-between mt-4">

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