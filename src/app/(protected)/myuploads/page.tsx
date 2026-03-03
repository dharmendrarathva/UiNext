"use client";

import { useEffect, useState } from "react";

interface Product {
  _id: string;
  status: string;
  visibility: string;
  createdAt: string;
  category?: { name: string };
}

export default function MyUploadsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/users/products/my"); // ✅ FIXED PATH

      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/users/products/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete product");
      }

      // Optimistic update (no refetch required)
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-10 text-white max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">My Uploads</h1>

      {loading ? (
        <p className="text-neutral-400">Loading...</p>
      ) : products.length === 0 ? (
        <p className="text-neutral-400">
          You haven’t uploaded any products yet.
        </p>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-neutral-900 p-6 rounded-xl flex justify-between items-center"
            >
              <div>
                <p className="text-sm text-neutral-400">
                  Category: {product.category?.name || "N/A"}
                </p>

                <p className="mt-2">
                  Status:{" "}
                  <span
                    className={`font-semibold ${
                      product.status === "APPROVED"
                        ? "text-green-500"
                        : product.status === "REJECTED"
                        ? "text-red-500"
                        : "text-yellow-500"
                    }`}
                  >
                    {product.status}
                  </span>
                </p>

                <p className="text-xs text-neutral-500 mt-1">
                  {new Date(product.createdAt).toLocaleDateString()}
                </p>
              </div>

              {product.status !== "APPROVED" && (
                <button
                  onClick={() => handleDelete(product._id)}
                  className="px-4 py-2 bg-red-600 rounded hover:bg-red-500 text-sm"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}