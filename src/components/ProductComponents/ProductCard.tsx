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
      <div className="bg-neutral-950 rounded-2xl overflow-hidden  transition shadow-lg flex flex-col">


        <div className="bg-neutral-900 border-b border-neutral-800">
          <MiniPreview codes={product.codes} />
        </div>
       <div>

  <div className="flex items-center justify-between px-4 py-2 text-sm">

    <span className="truncate text-neutral-200 font-medium">
      {product.title}
    </span>

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

      </div>

    </Link>

  );

}