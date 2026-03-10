"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import CardFooter from "@/components/ProductComponents/CardFooter";
import { Category } from "@/models/Category";

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

  const [comments,setComments] = useState<any[]>([]);
const [commentText,setCommentText] = useState("");
const [commentLoading,setCommentLoading] = useState(false);

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

  async function loadComments() {

  const res = await fetch(`/api/comment?productId=${product._id}`);

  if(!res.ok) return;

  const data = await res.json();

  setComments(data);

}

  useEffect(()=>{
    loadData();
  },[username,productSlug]);

  //////////////////////////////////////////////////////
  // RECORD VIEW
  //////////////////////////////////////////////////////

  useEffect(()=>{

    if(!product?._id) return;
    if(product?._id){
    loadComments();
  }

    fetch("/api/views",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({ productId:product._id })
    });

  },[product]);

  async function submitComment(){

  if(!session){
    setShowLoginPopup(true);
    return;
  }

  if(!commentText.trim()) return;

  setCommentLoading(true);

  try{

    const res = await fetch("/api/comment",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({
        productId:product._id,
        content:commentText
      })
    });

    if(!res.ok) return;

    const newComment = await res.json();

    setComments(prev=>[newComment,...prev]);
    setCommentText("");

  }catch(err){
    console.error(err);
  }
  finally{
    setCommentLoading(false);
  }

}

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

               {product.category && (
  <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 mt-8">

    <h2 className="text-lg font-semibold mb-3">
      # Tags
    </h2>

  <Link
  href={`/${product.category.slug}`}
  className="inline-flex items-center justify-center
  px-6 py-3
  text-base font-semibold
  bg-neutral-900 text-yellow-400
  border border-neutral-700
  rounded-xl
  hover:border-yellow-400 hover:text-yellow-300
  transition"
>
  {product.category.name}
</Link>

  </div>
)}


          </div>

        </div>

      </div>

      {/* COMMENTS */}

<div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 mt-8">

<h2 className="text-lg font-semibold mb-6">
Comments
</h2>

<div className="flex gap-3 mb-6">

<input
value={commentText}
onChange={(e)=>setCommentText(e.target.value)}
placeholder="Write a comment..."
className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 outline-none"
/>

<button
onClick={submitComment}
disabled={commentLoading}
className="bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-400"
>
Post
</button>

</div>

<div className="space-y-5">

{comments.length === 0 && (
<p className="text-neutral-500">
No comments yet
</p>
)}

{comments.map((c)=>(
<div key={c._id} className="flex gap-3">

<div className="w-8 h-8 rounded-full bg-neutral-700 overflow-hidden">

{c.user?.image ? (
<img src={c.user.image} className="w-full h-full object-cover"/>
) : (
<div className="flex items-center justify-center h-full text-sm">
{c.user?.username?.[0]?.toUpperCase()}
</div>
)}

</div>

<div>

<p className="text-sm font-semibold">
@{c.user?.username}
</p>

<p className="text-neutral-300 text-sm">
{c.content}
</p>

</div>

</div>
))}

</div>

</div>

    </div>

  );

}