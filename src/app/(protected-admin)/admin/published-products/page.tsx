"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductComponents/ProductCard";
import { Product } from "@/types/Product";

export default function PublishedProductsPage() {

  const [products,setProducts] = useState<Product[]>([]);
  const [loading,setLoading] = useState(true);

  ////////////////////////////////////////////////////
  // LOAD PRODUCTS
  ////////////////////////////////////////////////////

  async function loadProducts(){

    try{

      const res = await fetch("/api/products");

      if(!res.ok) return;

      const data = await res.json();

      setProducts(data);

    }catch(error){

      console.error("Failed to load products:",error);

    }finally{

      setLoading(false);

    }

  }

  useEffect(()=>{

    loadProducts();

  },[]);

  ////////////////////////////////////////////////////
  // LOADING
  ////////////////////////////////////////////////////

  if(loading){

    return(

      <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-neutral-400">
        Loading products...
      </div>

    );

  }

  ////////////////////////////////////////////////////
  // EMPTY STATE
  ////////////////////////////////////////////////////

  if(products.length === 0){

    return(

      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-950 text-white">

        <h2 className="text-2xl font-semibold">
          No published products
        </h2>

        <p className="text-neutral-400 mt-2">
          There are currently no approved marketplace products.
        </p>

      </div>

    );

  }

  ////////////////////////////////////////////////////
  // UI
  ////////////////////////////////////////////////////

  return(

    <div className="min-h-screen bg-neutral-950 px-6 md:px-16 py-12 text-white">

      <div className="mb-12">

        <h1 className="text-3xl md:text-4xl font-bold">
          Published Marketplace Products
        </h1>

        <p className="text-neutral-400 mt-2">
          All approved products visible to users.
        </p>

      </div>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

        {products.map((p)=>(
          <ProductCard key={p._id} product={p}/>
        ))}

      </div>    

    </div>

  );

}