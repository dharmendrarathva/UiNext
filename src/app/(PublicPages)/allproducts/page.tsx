"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  slug: string;
  thumbnail?: string;
  createdBy?: {
    username: string;
  };
}

export default function AllProducts() {
  const [products, setProducts] = useState<Product[]>([]);

  async function loadProducts() {
    try {
      const res = await fetch("/api/products");

      if (!res.ok) {
        console.error("API error");
        return;
      }

      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Fetch error", err);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h1 style={{ marginBottom: 30 }}>Marketplace</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
          gap: 20,
        }}
      >
        {products.map((p) => (
          <Link
            key={p._id}
            href={`/components/${p.createdBy?.username}/${p.slug}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div
              style={{
                border: "1px solid #ddd",
                padding: 20,
                borderRadius: 10,
                cursor: "pointer",
                transition: "0.2s",
              }}
            >
              {p.thumbnail && (
                <img
                  src={p.thumbnail}
                  style={{
                    width: "100%",
                    height: 160,
                    objectFit: "cover",
                    borderRadius: 6,
                    marginBottom: 10,
                  }}
                />
              )}

              <h3>{p.title}</h3>

              <p
                style={{
                  fontSize: 14,
                  color: "#666",
                  marginTop: 6,
                }}
              >
                {p.description}
              </p>

              <p style={{ marginTop: 10, fontWeight: 600 }}>
                ₹ {p.price}
              </p>

              <p
                style={{
                  marginTop: 6,
                  fontSize: 13,
                  color: "#888",
                }}
              >
                By {p.createdBy?.username}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}