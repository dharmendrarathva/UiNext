"use client";

import { useEffect, useState } from "react";
interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  status: string;
  rejectionReason?: string;

  parentProduct?: string;
  variationIndex?: number;
}

export default function MyProducts() {

  const [products, setProducts] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: 0,
  });

  //////////////////////////////////////////////////////
  // LOAD PRODUCTS
  //////////////////////////////////////////////////////

  async function loadProducts() {
    const res = await fetch("/api/users/products");
    const data = await res.json();
    setProducts(data);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  //////////////////////////////////////////////////////
  // FORM HANDLER
  //////////////////////////////////////////////////////

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  //////////////////////////////////////////////////////
  // CREATE
  //////////////////////////////////////////////////////

  async function createProduct(status: "DRAFT" | "PENDING") {
    await fetch("/api/users/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...form,
        status,
      }),
    });

    setForm({ title: "", description: "", price: 0 });
    loadProducts();
  }

  //////////////////////////////////////////////////////
  // UPDATE
  //////////////////////////////////////////////////////

  async function updateProduct(id: string) {
    await fetch(`/api/users/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setEditingId(null);
    setForm({ title: "", description: "", price: 0 });
    loadProducts();
  }

  //////////////////////////////////////////////////////
  // DELETE
  //////////////////////////////////////////////////////

  async function deleteProduct(id: string) {
    await fetch(`/api/users/products/${id}`, {
      method: "DELETE",
    });

    loadProducts();
  }

  //////////////////////////////////////////////////////
  // EDIT START
  //////////////////////////////////////////////////////

  function startEdit(p: Product) {
    setEditingId(p._id);

    setForm({
      title: p.title,
      description: p.description,
      price: p.price,
    });
  }

  //////////////////////////////////////////////////////
  // STATUS BADGE
  //////////////////////////////////////////////////////

  function statusBadge(status: string) {

    if (status === "APPROVED")
      return "bg-green-500/20 text-green-400";

    if (status === "REJECTED")
      return "bg-red-500/20 text-red-400";

    if (status === "DRAFT")
      return "bg-neutral-700 text-neutral-300";

    return "bg-yellow-500/20 text-yellow-400";
  }

  //////////////////////////////////////////////////////
  // UI
  //////////////////////////////////////////////////////

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-10">

      <h1 className="text-3xl font-bold text-yellow-400 mb-8">
        My Products
      </h1>

      {/* PRODUCT FORM */}

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 mb-10 max-w-xl">

        <h2 className="text-lg font-semibold mb-4">
          {editingId ? "Edit Product" : "Create Product"}
        </h2>

        <div className="space-y-4">

          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Title"
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2"
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2"
          />

          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2"
          />

          {editingId ? (

            <button
              onClick={() => updateProduct(editingId)}
              className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-lg font-semibold"
            >
              Update Product
            </button>

          ) : (

            <div className="flex gap-3">

              <button
                onClick={() => createProduct("DRAFT")}
                className="bg-neutral-700 px-4 py-2 rounded-lg"
              >
                Save Draft
              </button>

              <button
                onClick={() => createProduct("PENDING")}
                className="bg-blue-600 px-4 py-2 rounded-lg"
              >
                Submit for Review
              </button>

            </div>

          )}

        </div>

      </div>

      {/* PRODUCT LIST */}

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

        {products.map((p) => (

          <div
            key={p._id}
            className="bg-neutral-900 border border-neutral-800 rounded-xl p-6"
          >

            <h3 className="text-xl font-semibold mb-2">
              {p.title}
            </h3>

            <p className="text-neutral-400 text-sm mb-3">
              {p.description}
            </p>

            <p className="text-lg mb-3">
              ₹{p.price}
            </p>

            <span className={`text-xs px-3 py-1 rounded-full ${statusBadge(p.status)}`}>
              {p.status}
            </span>

            {p.status === "REJECTED" && (
              <div className="mt-3 text-sm text-red-400">
                Reason: {p.rejectionReason}
              </div>
            )}

            {p.status === "DRAFT" && (
              <button
                onClick={() =>
                  fetch(`/api/users/products/${p._id}/submit`, {
                    method: "PATCH",
                  }).then(loadProducts)
                }
                className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg text-sm mt-3"
              >
                Submit for Review
              </button>
            )}

<div className="flex flex-wrap gap-3 mt-5">
              <button
                disabled={p.status === "APPROVED"}
                onClick={() => startEdit(p)}
                className={`flex-1 px-3 py-2 rounded-lg text-sm ${
                  p.status === "APPROVED"
                    ? "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                    : "bg-neutral-700 hover:bg-neutral-600"
                }`}
              >
                Edit
              </button>

              <button
                onClick={() => deleteProduct(p._id)}
                className="flex-1 bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg text-sm"
              >
                Delete
              </button>

              

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}