"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductComponents/ProductCard";
import { Product } from "@/types/Product";

const PRODUCTS_PER_PAGE = 16;

export default function AllProducts() {

  const [products,setProducts] = useState<Product[]>([]);
  const [visibleCount,setVisibleCount] = useState(PRODUCTS_PER_PAGE);

  async function loadProducts(){

    const res = await fetch("/api/products");

    if(!res.ok) return;

    const data = await res.json();
    setProducts(data);

  }

  useEffect(()=>{
    loadProducts();
  },[]);

  const visibleProducts = products.slice(0,visibleCount);
  const hasMore = visibleCount < products.length;

  return (

    <div className="min-h-screen bg-neutral-950 px-6 md:px-16 py-12 text-white">

      <div className="mb-12">

        <h1 className="text-3xl md:text-4xl font-bold">
          Explore Marketplace
        </h1>

        <p className="text-neutral-400 mt-2">
          Discover premium 3D models crafted by talented creators.
        </p>

      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

        {visibleProducts.map((p)=>(
          <ProductCard key={p._id} product={p}/>
        ))}

      </div>

      {hasMore && (

        <div className="flex justify-center mt-12">

          <button
            onClick={()=>setVisibleCount(v=>v+PRODUCTS_PER_PAGE)}
            className="px-8 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-600"
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