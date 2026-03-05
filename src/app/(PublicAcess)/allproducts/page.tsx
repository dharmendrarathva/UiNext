"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CardFooter from "./cardFooter";

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

  const [products,setProducts] = useState<Product[]>([]);
  const [favorites,setFavorites] = useState<string[]>([]);
  const [likes,setLikes] = useState<string[]>([]);
  const [visibleCount,setVisibleCount] = useState(PRODUCTS_PER_PAGE);

  ////////////////////////////////////////////////////
  // LOAD PRODUCTS
  ////////////////////////////////////////////////////

  async function loadProducts(){

    const res = await fetch("/api/products");
    if(!res.ok) return;

    const data = await res.json();
    setProducts(data);

  }

  ////////////////////////////////////////////////////
  // LOAD FAVORITES
  ////////////////////////////////////////////////////

  async function loadFavorites(){

    const res = await fetch("/api/favorites");
    if(!res.ok) return;

    const data = await res.json();
    const ids = data.map((f:any)=>f.product._id);

    setFavorites(ids);

  }

  ////////////////////////////////////////////////////
  // LOAD LIKES
  ////////////////////////////////////////////////////

  async function loadLikes(){

    const res = await fetch("/api/likes");
    if(!res.ok) return;

    const data = await res.json();
    const ids = data.map((l:any)=>l.product._id);

    setLikes(ids);

  }

  ////////////////////////////////////////////////////
  // TOGGLE LIKE
  ////////////////////////////////////////////////////

  async function toggleLike(productId:string){

    const res = await fetch("/api/likes",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({productId})
    });

    const data = await res.json();

    setProducts(prev =>
      prev.map(p => {

        if(p._id !== productId) return p;

        return {
          ...p,
          likesCount: data.liked
            ? (p.likesCount ?? 0) + 1
            : (p.likesCount ?? 0) - 1
        };

      })
    );

    if(data.liked){
      setLikes(prev => [...prev,productId]);
    }else{
      setLikes(prev => prev.filter(id=>id!==productId));
    }

  }

  ////////////////////////////////////////////////////
  // TOGGLE SAVE
  ////////////////////////////////////////////////////

  async function toggleFavorite(productId:string){

    const res = await fetch("/api/favorites",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({productId})
    });

    const data = await res.json();

    setProducts(prev =>
      prev.map(p => {

        if(p._id !== productId) return p;

        return {
          ...p,
          favoritesCount: data.favorited
            ? (p.favoritesCount ?? 0) + 1
            : (p.favoritesCount ?? 0) - 1
        };

      })
    );

    if(data.favorited){
      setFavorites(prev => [...prev,productId]);
    }else{
      setFavorites(prev => prev.filter(id=>id!==productId));
    }

  }

  ////////////////////////////////////////////////////
  // INIT
  ////////////////////////////////////////////////////

  useEffect(()=>{

    loadProducts();
    loadFavorites();
    loadLikes();

  },[]);

  const visibleProducts = products.slice(0,visibleCount);
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

      {/* GRID */}

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

        {visibleProducts.map((p)=>{

          const isSaved = favorites.includes(p._id);
          const isLiked = likes.includes(p._id);

          return(

            <Link
              key={p._id}
              href={`/components/${p.createdBy?.username}/${p.slug}`}
              className="group"
            >

              <div className="bg-neutral-950 rounded-2xl overflow-hidden border border-neutral-700 hover:border-neutral-600 transition shadow-lg flex flex-col">

                {/* IMAGE */}

                <div className="h-52 bg-neutral-900 flex items-center justify-center overflow-hidden">

                  {p.thumbnail ? (

                    <img
                      src={p.thumbnail}
                      alt={p.title}
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
                    {p.title}
                  </h3>

                  <p className="text-sm text-neutral-400 mt-2 line-clamp-2">
                    {p.description}
                  </p>

                  <div className="flex justify-between mt-4">

                    <span className="text-blue-400 font-bold">
                      ₹{p.price}
                    </span>

                    <span className="text-xs text-neutral-500">
                      @{p.createdBy?.username}
                    </span>

                  </div>

                  {/* FOOTER COMPONENT */}

                  <CardFooter
                    productId={p._id}
                    views={p.viewsCount ?? 0}
                    likes={p.likesCount ?? 0}
                    saves={p.favoritesCount ?? 0}
                    liked={isLiked}
                    saved={isSaved}
                    onLike={toggleLike}
                    onSave={toggleFavorite}
                  />

                </div>

              </div>

            </Link>

          );

        })}

      </div>

      {/* LOAD MORE */}

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