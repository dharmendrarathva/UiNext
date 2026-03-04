"use client";

import { useEffect, useState, use } from "react";

export default function ProductPage({
  params,
}: {
  params: Promise<{ username: string; productSlug: string }>;
}) {
  const { username, productSlug } = use(params);

  const [product, setProduct] = useState<any>(null);

  async function loadProduct() {
    const res = await fetch(
      `/api/products/${username}/${productSlug}`
    );

    const data = await res.json();
    setProduct(data);
  }

  useEffect(() => {
    loadProduct();
  }, [username, productSlug]);

  if (!product) return <p>Loading...</p>;

  return (
    <div style={{ padding: 40, maxWidth: 800, margin: "auto" }}>
      <h1>{product.title}</h1>

      {product.thumbnail && (
        <img
          src={product.thumbnail}
          style={{
            width: "100%",
            borderRadius: 8,
            marginBottom: 20,
          }}
        />
      )}

      <p>{product.description}</p>

      <h3>Price: ₹{product.price}</h3>

      <p>Author: {product.createdBy?.username}</p>
    </div>
  );
}