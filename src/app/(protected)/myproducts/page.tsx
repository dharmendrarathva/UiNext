"use client";

import { useEffect, useState } from "react";

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  status: string;
  rejectionReason?: string;
}

export default function MyProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: 0,
  });

  const [editingId, setEditingId] = useState<string | null>(null);

  async function loadProducts() {
    const res = await fetch("/api/users/products");
    const data = await res.json();
    setProducts(data);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function handleChange(e: any) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function createProduct() {
    const res = await fetch("/api/users/products", {
      method: "POST",
      body: JSON.stringify(form),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      setForm({ title: "", description: "", price: 0 });
      loadProducts();
    }
  }

  async function updateProduct(id: string) {
    const res = await fetch(`/api/users/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(form),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      setEditingId(null);
      setForm({ title: "", description: "", price: 0 });
      loadProducts();
    }
  }

  async function deleteProduct(id: string) {
    const res = await fetch(`/api/users/products/${id}`, {
      method: "DELETE",
    });

    if (res.ok) loadProducts();
  }

  function startEdit(p: Product) {
    setEditingId(p._id);
    setForm({
      title: p.title,
      description: p.description,
      price: p.price,
    });
  }

  function statusBadge(status: string) {
    if (status === "APPROVED")
      return "bg-green-500/20 text-green-400";
    if (status === "REJECTED")
      return "bg-red-500/20 text-red-400";
    return "bg-yellow-500/20 text-yellow-400";
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-10">

      {/* PAGE TITLE */}
      <h1 className="text-3xl font-bold text-yellow-400 mb-8">
        My Products
      </h1>

      {/* CREATE / EDIT FORM */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 mb-10 max-w-xl">

        <h2 className="text-lg font-semibold mb-4">
          {editingId ? "Edit Product" : "Create New Product"}
        </h2>

        <div className="space-y-4">

          <input
            name="title"
            placeholder="Product Title"
            value={form.title}
            onChange={handleChange}
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2"
          />

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2"
          />

          <input
            name="price"
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
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
            <button
              onClick={createProduct}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold"
            >
              Create Product
            </button>
          )}
        </div>
      </div>

      {/* PRODUCT LIST */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

        {products.map((p) => (
          <div
            key={p._id}
            className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-yellow-400 transition"
          >
            <h3 className="text-xl font-semibold mb-2">
              {p.title}
            </h3>

            <p className="text-neutral-400 text-sm mb-3">
              {p.description}
            </p>

            <p className="text-lg font-medium mb-3">
              ₹{p.price}
            </p>

            {/* STATUS BADGE */}
            <span
              className={`text-xs px-3 py-1 rounded-full ${statusBadge(
                p.status
              )}`}
            >
              {p.status}
            </span>

            {/* REJECTION MESSAGE */}
            {p.status === "REJECTED" && (
              <div className="mt-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-2 rounded">
                Reason: {p.rejectionReason}
              </div>
            )}

            {/* ACTIONS */}
            <div className="flex gap-3 mt-5">

              <button
                onClick={() => startEdit(p)}
                className="flex-1 bg-neutral-700 hover:bg-neutral-600 px-3 py-2 rounded-lg text-sm"
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