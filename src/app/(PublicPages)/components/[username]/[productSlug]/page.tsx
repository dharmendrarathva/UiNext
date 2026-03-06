"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import CardFooter from "@/components/ProductComponents/CardFooter";

export default function ProductPage({
  params,
}: {
  params: Promise<{ username: string; productSlug: string }>;
}) {

  const { username, productSlug } = use(params);

  const router = useRouter();
  const { data: session } = useSession();

  const [product,setProduct] = useState<any>(null);
  const [inCart,setInCart] = useState(false);
  const [loading,setLoading] = useState(true);

  const [showCartPopup,setShowCartPopup] = useState(false);
  const [showLoginPopup,setShowLoginPopup] = useState(false);

  //////////////////////////////////////////////////////
  // LOAD DATA
  //////////////////////////////////////////////////////

  async function loadData(){

    try{

      const [productRes,cartRes] = await Promise.all([
        fetch(`/api/products/${username}/${productSlug}`),
        fetch("/api/cart"),
      ]);

      const productData = await productRes.json();
      const cartData = await cartRes.json();

      setProduct(productData);

      const cartExists =
        cartData.items?.some(
          (item:any)=>item.product?._id === productData?._id
        ) ?? false;

      setInCart(cartExists);

    }catch(err){
      console.error(err);
    }
    finally{
      setLoading(false);
    }

  }

  useEffect(()=>{
    loadData();
  },[username,productSlug]);

  //////////////////////////////////////////////////////
  // RECORD VIEW
  //////////////////////////////////////////////////////

  useEffect(()=>{

    if(!product?._id) return;

    fetch("/api/views",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({ productId:product._id })
    });

  },[product]);

  //////////////////////////////////////////////////////
  // CART
  //////////////////////////////////////////////////////

  async function addToCart(){

    if(!session){
      setShowLoginPopup(true);
      return;
    }

    await fetch("/api/cart/add",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({ productId:product._id })
    });

    setInCart(true);
    setShowCartPopup(true);

  }

  async function removeFromCart(){

    await fetch("/api/cart/remove",{
      method:"DELETE",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({ productId:product._id })
    });

    setInCart(false);

  }

  //////////////////////////////////////////////////////
  // LOADING
  //////////////////////////////////////////////////////

  if(loading){
    return(
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-neutral-500">
        Loading product...
      </div>
    );
  }

  if(!product){
    return(
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-neutral-500">
        Product not found
      </div>
    );
  }

  //////////////////////////////////////////////////////
  // UI
  //////////////////////////////////////////////////////

  return(

    <div className="min-h-screen bg-neutral-950 text-white">

      <div className="max-w-6xl mx-auto px-6 md:px-10 py-16">

        {/* CREATOR */}

        <Link
          href={`/users/${product.createdBy?._id}`}
          className="inline-flex items-center gap-4 mb-10"
        >

          <div className="w-12 h-12 rounded-full bg-neutral-800 border border-neutral-700 overflow-hidden flex items-center justify-center text-lg font-semibold">

            {product.createdBy?.image ? (
              <img
                src={product.createdBy.image}
                alt={product.createdBy.username}
                className="w-full h-full object-cover"
              />
            ) : (
              product.createdBy?.username?.[0]?.toUpperCase()
            )}

          </div>

          <div>
            <p className="font-medium">@{product.createdBy?.username}</p>
            <p className="text-xs text-neutral-500">View Profile</p>
          </div>

        </Link>

        {/* PRODUCT */}

        <div className="grid lg:grid-cols-2 gap-14">

          {/* IMAGE */}

          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden">

            {product.thumbnail ? (
              <img
                src={product.thumbnail}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="h-[400px] flex items-center justify-center text-neutral-500 bg-neutral-800">
                No Preview
              </div>
            )}

          </div>

          {/* DETAILS */}

          <div>

            <h1 className="text-4xl font-bold mb-6">
              {product.title}
            </h1>

            {/* PRICE */}

            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 mb-6">
              <p className="text-sm text-neutral-500 mb-2">Price</p>
              <p className="text-3xl font-semibold">
                ₹ {product.price}
              </p>
            </div>

            {/* INTERACTIONS */}

            <CardFooter
              productId={product._id}
              views={product.viewsCount ?? 0}
              likes={product.likesCount ?? 0}
              saves={product.favoritesCount ?? 0}
              initialLiked={product.liked ?? false}
              initialSaved={product.saved ?? false}
            />

            {/* CART */}

            <div className="mt-8">

              {!inCart ? (
                <button
                  onClick={addToCart}
                  className="w-full bg-yellow-500 text-black py-3 rounded-xl hover:bg-yellow-400 transition"
                >
                  Add to Cart
                </button>
              ) : (
                <button
                  onClick={removeFromCart}
                  className="w-full bg-red-500 text-white py-3 rounded-xl hover:bg-red-400 transition"
                >
                  Remove From Cart
                </button>
              )}

            </div>

            {/* DESCRIPTION */}

            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 mt-8">

              <h2 className="text-lg font-semibold mb-4">
                Description
              </h2>

              <p className="text-neutral-300 leading-relaxed">
                {product.description}
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}