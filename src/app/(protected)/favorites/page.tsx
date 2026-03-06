// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";

// interface FavoriteProduct {
//   _id: string;
//   product: {
//     _id: string;
//     title: string;
//     slug: string;
//     price: number;
//     thumbnail?: string;
//     createdBy?: {
//       username: string;
//     };
//   };
// }

// export default function FavoritesPage() {
//   const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
//   const [loading, setLoading] = useState(true);

//   ////////////////////////////////////////////////////
//   // LOAD FAVORITES
//   ////////////////////////////////////////////////////

//   async function loadFavorites() {
//     try {
//       const res = await fetch("/api/favorites");

//       if (!res.ok) return;

//       const data = await res.json();

//       setFavorites(data);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   }

//   ////////////////////////////////////////////////////
//   // REMOVE FAVORITE
//   ////////////////////////////////////////////////////

//   async function removeFavorite(productId: string) {
//     try {
//       const res = await fetch("/api/favorites", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ productId }),
//       });

//       if (!res.ok) return;

//       const data = await res.json();

//       if (!data.favorited) {
//         setFavorites((prev) =>
//           prev.filter((f) => f.product._id !== productId)
//         );
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   }

//   ////////////////////////////////////////////////////
//   // INIT
//   ////////////////////////////////////////////////////

//   useEffect(() => {
//     loadFavorites();
//   }, []);

//   ////////////////////////////////////////////////////
//   // LOADING
//   ////////////////////////////////////////////////////

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-white bg-neutral-950">
//         Loading favorites...
//       </div>
//     );
//   }

//   ////////////////////////////////////////////////////
//   // EMPTY STATE
//   ////////////////////////////////////////////////////

//   if (favorites.length === 0) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center text-center text-white bg-neutral-950">
//         <h2 className="text-2xl font-semibold">No saved products</h2>
//         <p className="text-neutral-400 mt-2">
//           Save products to see them here.
//         </p>
//       </div>
//     );
//   }

//   ////////////////////////////////////////////////////
//   // UI
//   ////////////////////////////////////////////////////

//   return (
//     <div className="min-h-screen bg-neutral-950 px-6 md:px-16 py-12 text-white">

//       <h1 className="text-3xl font-bold mb-10">
//         Your Saved Products
//       </h1>

//       <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//         {favorites.map((fav) => {
//           const p = fav.product;

//           return (
//             <Link
//               key={p._id}
//               href={`/components/${p.createdBy?.username}/${p.slug}`}
//               className="group"
//             >
//               <div className="bg-neutral-950 rounded-2xl overflow-hidden border border-neutral-700 hover:border-neutral-600 transition-all duration-300">

//                 {/* Image */}
//                 <div className="relative h-52 overflow-hidden">

//                   <button
//                     onClick={(e) => {
//                       e.preventDefault();
//                       e.stopPropagation();
//                       removeFavorite(p._id);
//                     }}
//                     className="absolute top-3 right-3 px-3 py-1 text-xs rounded-lg bg-yellow-500 text-black"
//                   >
//                     Saved
//                   </button>

//                   {p.thumbnail ? (
//                     <img
//                       src={p.thumbnail}
//                       alt={p.title}
//                       className="w-full h-full object-cover group-hover:scale-110 transition"
//                     />
//                   ) : (
//                     <div className="flex items-center justify-center h-full bg-neutral-900 text-slate-500">
//                       No Image
//                     </div>
//                   )}
//                 </div>

//                 {/* Content */}
//                 <div className="p-5">

//                   <h3 className="font-semibold text-lg line-clamp-1">
//                     {p.title}
//                   </h3>

//                   <div className="flex items-center justify-between mt-4">
//                     <span className="text-blue-400 font-bold">
//                       ₹{p.price}
//                     </span>

//                     <span className="text-xs text-neutral-500">
//                       @{p.createdBy?.username}
//                     </span>
//                   </div>

//                 </div>

//               </div>
//             </Link>
//           );
//         })}
//       </div>

//     </div>
//   );
// }






"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductComponents/ProductCard";
import { Product } from "@/types/Product";

interface FavoriteItem {
  _id: string
  product: Product
}

export default function FavoritesPage() {

  const [favorites,setFavorites] = useState<FavoriteItem[]>([])
  const [loading,setLoading] = useState(true)

  ////////////////////////////////////////////////////
  // LOAD FAVORITES
  ////////////////////////////////////////////////////

  async function loadFavorites(){

    try{

      const res = await fetch("/api/favorites")

      if(!res.ok) return

      const data = await res.json()

      setFavorites(data)

    }catch(err){

      console.error(err)

    }finally{

      setLoading(false)

    }

  }

  ////////////////////////////////////////////////////
  // INIT
  ////////////////////////////////////////////////////

  useEffect(()=>{
    loadFavorites()
  },[])

  ////////////////////////////////////////////////////
  // LOADING
  ////////////////////////////////////////////////////

  if(loading){

    return(
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-neutral-400">
        Loading favorites...
      </div>
    )

  }

  ////////////////////////////////////////////////////
  // EMPTY STATE
  ////////////////////////////////////////////////////

  if(favorites.length === 0){

    return(

      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-950 text-center text-white">

        <h2 className="text-2xl font-semibold">
          No saved products
        </h2>

        <p className="text-neutral-400 mt-2">
          Save products to see them here.
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
        Your Saved Products
      </h1>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

        {favorites.map(f => (

          <ProductCard
            key={f.product._id}
            product={f.product}
          />

        ))}

      </div>

    </div>

  )

}