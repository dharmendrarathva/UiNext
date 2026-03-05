"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function ProductPage({
  params,
}: {
  params: Promise<{ username: string; productSlug: string }>;
}) {
  const { username, productSlug } = use(params);

  const router = useRouter();
  const { data: session } = useSession();

  const [product, setProduct] = useState<any>(null);

  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  const [likesCount, setLikesCount] = useState(0);
  const [savesCount, setSavesCount] = useState(0);
  const [views, setViews] = useState(0);

  const [inCart, setInCart] = useState(false);  

  const [loading, setLoading] = useState(true);

  const [showCartPopup, setShowCartPopup] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  //////////////////////////////////////////////////////
  // LOAD DATA
  //////////////////////////////////////////////////////

  async function loadData() {
    try {
      const [productRes, cartRes, likeRes, favRes] = await Promise.all([
        fetch(`/api/products/${username}/${productSlug}`),
        fetch("/api/cart"),
        fetch("/api/likes"),
        fetch("/api/favorites"),

      ]);

      const productData = await productRes.json();
      const cartData = await cartRes.json();
      const likeData = await likeRes.json();
      const favData = await favRes.json();


      setProduct(productData);

      setLikesCount(productData.likesCount || 0);
      setSavesCount(productData.favoritesCount || 0);
      setViews(productData.viewsCount || 0);

 const cartExists =
  cartData.items?.some(
    (item: any) => item.product?._id === productData?._id
  ) ?? false;

      setInCart(cartExists);

      const likedIds = likeData.map((l: any) => l.product._id);
      const savedIds = favData.map((f: any) => f.product._id);

      setLiked(likedIds.includes(productData._id));
      setSaved(savedIds.includes(productData._id));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [username, productSlug]);

  useEffect(() => {
  if (product?._id) {
    recordView(product._id);
  }
}, [product]);


  async function recordView(productId: string) {
  try {
    const res = await fetch("/api/views", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId }),
    });

    const data = await res.json();

    if (data.views !== undefined) {
      setViews(data.views);
    }

  } catch (err) {
    console.error(err);
  }
}

  //////////////////////////////////////////////////////
  // LIKE
  //////////////////////////////////////////////////////

  async function toggleLike() {
    if (!session) {
      setShowLoginPopup(true);
      return;
    }

    const res = await fetch("/api/likes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId: product._id }),
    });

    const data = await res.json();

    if (data.liked) {
      setLiked(true);
      setLikesCount((prev: number) => prev + 1);
    } else {
      setLiked(false);
      setLikesCount((prev: number) => prev - 1);
    }
  }

  //////////////////////////////////////////////////////
  // SAVE
  //////////////////////////////////////////////////////

  async function toggleSave() {
    if (!session) {
      setShowLoginPopup(true);
      return;
    }

    const res = await fetch("/api/favorites", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId: product._id }),
    });

    const data = await res.json();

    if (data.favorited) {
      setSaved(true);
      setSavesCount((prev: number) => prev + 1);
    } else {
      setSaved(false);
      setSavesCount((prev: number) => prev - 1);
    }
  }

  //////////////////////////////////////////////////////
  // CART
  //////////////////////////////////////////////////////

  async function addToCart() {
    if (!session) {
      setShowLoginPopup(true);
      return;
    }

    await fetch("/api/cart/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId: product._id,
      }),
    });

    setInCart(true);
    setShowCartPopup(true);
  }

  async function removeFromCart() {
    await fetch("/api/cart/remove", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId: product._id,
      }),
    });

    setInCart(false);
  }

  //////////////////////////////////////////////////////
  // LOADING
  //////////////////////////////////////////////////////

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-neutral-500">
        Loading product...
      </div>
    );
  }

  //////////////////////////////////////////////////////
  // PRODUCT NOT FOUND
  //////////////////////////////////////////////////////

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-neutral-500">
        Product not found
      </div>
    );
  }

  //////////////////////////////////////////////////////
  // UI
  //////////////////////////////////////////////////////

  return (
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
              <p className="text-sm text-neutral-500 mb-2">
                Price
              </p>
              <p className="text-3xl font-semibold">
                ₹ {product.price}
              </p>
            </div>

            {/* INTERACTIONS */}

          <div className="flex gap-4 mb-8">

<button
onClick={toggleLike}
className={`flex-1 py-3 rounded-xl border transition
${
liked
? "bg-red-500 border-red-400"
: "bg-neutral-900 border-neutral-700 hover:bg-neutral-800"
}`}
>
❤️ {likesCount} Likes
</button>

<button
onClick={toggleSave}
className={`flex-1 py-3 rounded-xl border transition
${
saved
? "bg-yellow-500 text-black border-yellow-400"
: "bg-neutral-900 border-neutral-700 hover:bg-neutral-800"
}`}
>
⭐ {savesCount} Saves
</button>

<div className="flex-1 py-3 rounded-xl border bg-neutral-900 border-neutral-700 text-center">
👁 {views} Views
</div>

</div>
            {/* CART */}

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

          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowCartPopup(false)}
          />

          <div className="relative bg-neutral-900 border border-neutral-800 rounded-xl p-6 w-80">

            <p className="text-green-400 text-center mb-4">
              🛒 Added to cart!
            </p>

            <button
              onClick={() => router.push("/mycart")}
              className="w-full bg-yellow-500 text-black py-2 rounded-lg"
            >
              View Cart
            </button>

          </div>

        </div>
      )}

      {/* LOGIN POPUP */}

      {showLoginPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50">

          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowLoginPopup(false)}
          />

          <div className="relative bg-neutral-900 border border-neutral-800 rounded-xl p-6 w-80">

            <h3 className="text-lg font-semibold text-center mb-3">
              Login Required
            </h3>

            <p className="text-neutral-400 text-sm text-center mb-6">
              Please login to interact with products.
            </p>

            <Link
              href="/login?mode=login"
              className="block text-center bg-yellow-500 text-black py-2 rounded-lg"
            >
              Login Now
            </Link>

          </div>

        </div>
      )}

    </div>
  );
}