"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

import CardFooter from "@/components/ProductComponents/CardFooter";
import CommentsSection from "@/components/ProductComponents/CommentsSection";
import Preview from "@/components/ProductDisplay/Preview";

export default function ProductPage({
  params,
}: {
  params: Promise<{ username: string; productSlug: string }>;
}) {
  const { username, productSlug } = use(params);
  const { data: session } = useSession();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  //////////////////////////////////////////////////////
  // LOAD PRODUCT
  //////////////////////////////////////////////////////

  async function loadProduct() {
    try {
      const res = await fetch(`/api/products/${username}/${productSlug}`);

      const data = await res.json();

      setProduct(data);
    } catch (err) {
      console.error("Product load error:", err);
    } finally {
      setLoading(false);
    }
  }

  //////////////////////////////////////////////////////
  // REGISTER VIEW
  //////////////////////////////////////////////////////

  async function registerView(productId: string) {
    try {
      const viewedKey = `viewed-${productId}`;

      // prevent refresh spam
      if (sessionStorage.getItem(viewedKey)) return;

      await fetch("/api/views", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      });

      sessionStorage.setItem(viewedKey, "true");

    } catch (err) {
      console.error("View error:", err);
    }
  }

  //////////////////////////////////////////////////////
  // EFFECTS
  //////////////////////////////////////////////////////

  useEffect(() => {
    loadProduct();
  }, [username, productSlug]);

  useEffect(() => {
    if (!product?._id) return;

    registerView(product._id);
  }, [product?._id]);

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
      <div className="w-full px-10 py-10">

        {/* PRODUCT */}
        <div className="grid gap-12">

          {/* COMPONENT PREVIEW */}
          <Preview codes={product.codes} />

        </div>

        {/* CREATOR */}
        <Link
          href={`/users/${product.createdBy?.username}`}
          className="flex items-center gap-4 mb-10 mt-6"
        >
          <div className="w-12 h-12 rounded-full bg-neutral-800 overflow-hidden">

            {product.createdBy?.image ? (
              <img
                src={product.createdBy.image}
                className="w-full h-full object-cover"
                alt="creator"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                {product.createdBy?.username?.[0]?.toUpperCase()}
              </div>
            )}

          </div>

          <div>
            <p>@{product.createdBy?.username}</p>
            <p className="text-xs text-neutral-500">View profile</p>
          </div>
        </Link>

        {/* DETAILS */}
        <div>

          <h1 className="text-4xl font-bold mb-6">
            {product.title}
          </h1>

          {/* INTERACTIONS */}
          <CardFooter
            productId={product._id}
            views={product.viewsCount ?? 0}
            likes={product.likesCount ?? 0}
            saves={product.favoritesCount ?? 0}
            initialLiked={product.liked ?? false}
            initialSaved={product.saved ?? false}
          />

        </div>

        {/* COMMENTS */}
        <div className="mt-16">
          <CommentsSection productId={product._id} />
        </div>

      </div>
    </div>
  );
}