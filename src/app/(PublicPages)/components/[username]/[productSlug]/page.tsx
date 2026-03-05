"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProductPage({
  params,
}: {
  params: Promise<{ username: string; productSlug: string }>;
}) {
  const { username, productSlug } = use(params);

  const router = useRouter();

  const [product, setProduct] = useState<any>(null);
  const [inCart, setInCart] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showCartPopup, setShowCartPopup] = useState(false);

  /* ---------------- LOAD DATA ---------------- */

  async function loadData() {
    try {
      const [productRes, cartRes] = await Promise.all([
        fetch(`/api/products/${username}/${productSlug}`),
        fetch("/api/cart"),
      ]);

      const productData = await productRes.json();
      const cartData = await cartRes.json();

      setProduct(productData);

      const exists = cartData.items?.some(
        (item: any) => item.product._id === productData._id
      );

      setInCart(exists);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [username, productSlug]);

  /* ---------------- ADD TO CART ---------------- */

  async function addToCart() {
    await fetch("/api/cart/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId: product._id }),
    });

    setInCart(true);
    setShowCartPopup(true);
  }

  /* ---------------- REMOVE CART ---------------- */

  async function removeFromCart() {
    await fetch("/api/cart/remove", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId: product._id }),
    });

    setInCart(false);
  }

  /* ---------------- LOADING ---------------- */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-neutral-500">
        Loading product...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-neutral-500">
        Product not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-16">

        {/* CREATOR */}

        <Link
          href={`/users/${product.createdBy?._id}`}
          className="inline-flex items-center gap-4 mb-10 group"
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
            <p className="font-medium group-hover:underline">
              @{product.createdBy?.username}
            </p>
            <p className="text-xs text-neutral-500">
              View Profile
            </p>
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
                No Preview Available
              </div>
            )}
          </div>

          {/* DETAILS */}

          <div className="flex flex-col">

            <h1 className="text-4xl font-bold tracking-tight mb-6">
              {product.title}
            </h1>

            {/* PRICE */}

            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 mb-8">
              <p className="text-sm text-neutral-500 mb-2">Price</p>
              <p className="text-3xl font-semibold">₹ {product.price}</p>
            </div>

            {/* CART BUTTON */}

            {!inCart ? (
              <button
                onClick={addToCart}
                className="w-full bg-yellow-500 text-black font-medium py-3 rounded-xl hover:bg-yellow-400 transition"
              >
                Add to Cart
              </button>
            ) : (
              <button
                onClick={removeFromCart}
                className="w-full bg-red-500 text-white font-medium py-3 rounded-xl hover:bg-red-400 transition"
              >
                Remove From Cart
              </button>
            )}

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

      {/* CART POPUP */}

     {showCartPopup && (
  <div className="fixed inset-0 flex items-center justify-center z-50">

    {/* Overlay */}
    <div
      className="absolute inset-0 bg-black/50"
      onClick={() => setShowCartPopup(false)}
    />

    {/* Modal */}
    <div className="relative bg-neutral-900 border border-neutral-800 rounded-xl p-6 w-80 shadow-xl">

      <p className="mb-4 font-medium text-green-400 text-center">
        🛒 Added to cart!
      </p>

      {/* Product Info */}
      <div className="bg-neutral-800 rounded-lg p-4 mb-4">

        <p className="font-semibold text-white line-clamp-1">
          {product.title}
        </p>

        <p className="text-sm text-neutral-400 mt-1">
          ₹ {product.price}
        </p>

      </div>

      {/* Buttons */}
      <div className="flex gap-3">

        <button
          onClick={() => router.push("/mycart")}
          className="flex-1 bg-yellow-500 text-black py-2 rounded-lg hover:bg-yellow-400 transition"
        >
          View Cart
        </button>

        <button
          onClick={() => setShowCartPopup(false)}
          className="flex-1 bg-neutral-800 text-white py-2 rounded-lg hover:bg-neutral-700 transition"
        >
          Letter
        </button>

      </div>

    </div>
  </div>
)}

    </div>
  );
}