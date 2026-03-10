"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductComponents/ProductCard";
import { Product } from "@/types/Product";

interface LikeItem {
  _id: string
  product: Product
}

export default function LikedPage() {

  const [likes,setLikes] = useState<LikeItem[]>([])
  const [loading,setLoading] = useState(true)

  ////////////////////////////////////////////////////
  // LOAD LIKES
  ////////////////////////////////////////////////////

  async function loadLikes(){

    try{

const res = await fetch("/api/favorites", {
  cache: "no-store"
})
      if(!res.ok) return

      const data = await res.json()

      setLikes(data)

    }catch(err){

      console.error(err)

    }finally{

      setLoading(false)

    }

  }

  useEffect(()=>{
    loadLikes()
  },[])

  ////////////////////////////////////////////////////
  // LOADING
  ////////////////////////////////////////////////////

  if(loading){

    return(
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-neutral-400">
        Loading liked products...
      </div>
    )

  }

  ////////////////////////////////////////////////////
  // EMPTY STATE
  ////////////////////////////////////////////////////

  if(likes.length === 0){

    return(

      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-950 text-white">

        <h2 className="text-2xl font-semibold">
          No liked products
        </h2>

        <p className="text-neutral-400 mt-2">
          Like products to see them here.
        </p>

      </div>

    )

  }

  ////////////////////////////////////////////////////
  // UI
  ////////////////////////////////////////////////////

  return(

    <div className="min-h-screen bg-neutral-950 px-6 md:px-16 py-12 text-white">

      <h1 className="text-3xl font-bold mb-10">
        Liked Products
      </h1>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

        {likes.map(l => (

          <ProductCard
            key={l.product._id}
            product={l.product}
          />

        ))}

      </div>

    </div>

  )

}