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

  return (
    <div style={{ padding: 20 }}>
      <h1>My Products</h1>

      {/* CREATE / EDIT FORM */}
      <div style={{ marginBottom: 20 }}>
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
        />

        <input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />

        <input
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
        />

        {editingId ? (
          <button onClick={() => updateProduct(editingId)}>
            Update Product
          </button>
        ) : (
          <button onClick={createProduct}>
            Create Product
          </button>
        )}
      </div>

      {/* PRODUCT LIST */}
      {products.map((p) => (
        <div
          key={p._id}
          style={{
            border: "1px solid #ccc",
            padding: 10,
            marginBottom: 10,
          }}
        >
          <h3>{p.title}</h3>

          <p>{p.description}</p>

          <p>Price: ₹{p.price}</p>

          <p>Status: {p.status}</p>

          {p.status === "REJECTED" && (
            <p style={{ color: "red" }}>
              Reason: {p.rejectionReason}
            </p>
          )}

          <button onClick={() => startEdit(p)}>Edit</button>

          <button
            onClick={() => deleteProduct(p._id)}
            style={{ marginLeft: 10 }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}