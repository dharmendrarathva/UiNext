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

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: 0,
  });

  const [createModal, setCreateModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

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

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {

    setForm({
      ...form,
      [e.target.name]:
        e.target.name === "price"
          ? Number(e.target.value)
          : e.target.value,
    });

  }

  //////////////////////////////////////////////////////
  // CREATE PRODUCT
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

    setCreateModal(false);

    setForm({
      title: "",
      description: "",
      price: 0,
    });

    loadProducts();
  }

  //////////////////////////////////////////////////////
  // START EDIT
  //////////////////////////////////////////////////////

  function startEdit(product: Product) {

    setEditingProduct(product);

    setForm({
      title: product.title,
      description: product.description,
      price: product.price,
    });

    setEditModal(true);
  }

  //////////////////////////////////////////////////////
  // UPDATE PRODUCT
  //////////////////////////////////////////////////////

  async function updateProduct() {

    if (!editingProduct) return;

    await fetch(`/api/users/products/${editingProduct._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setEditModal(false);
    setEditingProduct(null);

    setForm({
      title: "",
      description: "",
      price: 0,
    });

    loadProducts();
  }

  //////////////////////////////////////////////////////
  // DELETE PRODUCT
  //////////////////////////////////////////////////////

  async function deleteProduct(id: string) {

    await fetch(`/api/users/products/${id}`, {
      method: "DELETE",
    });

    loadProducts();
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

      {/* HEADER */}

      <div className="flex justify-between items-center mb-10">

        <h1 className="text-3xl font-bold text-yellow-400">
          My Products
        </h1>

        <button
          onClick={() => setCreateModal(true)}
          className="bg-yellow-500 hover:bg-yellow-600 px-5 py-2 rounded-lg font-semibold"
        >
          + Create Product
        </button>

      </div>

      {/* PRODUCT GRID */}

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
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm mt-3 ml-26"
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

      {/* CREATE MODAL */}

      {createModal && (

        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">

          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 w-full max-w-lg">

            <h2 className="text-xl font-semibold mb-6 text-yellow-400">
              Create Product
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

              <div className="flex gap-3 pt-4">

                <button
                  onClick={() => createProduct("DRAFT")}
                  className="flex-1 bg-neutral-700 hover:bg-neutral-600 py-2 rounded-lg"
                >
                  Save Draft
                </button>

                <button
                  onClick={() => createProduct("PENDING")}
                className="w-full mt-3 bg-neutral-800 hover:bg-neutral-700 py-2 rounded-lg"
                >
                  Submit Review
                </button>

              </div>

              <button
                onClick={() => setCreateModal(false)}
                className="w-full mt-3 bg-neutral-800 hover:bg-neutral-700 py-2 rounded-lg"
              >
                Cancel
              </button>

            </div>

          </div>

        </div>

      )}

      {/* EDIT MODAL */}

      {editModal && (

        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">

          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 w-full max-w-lg">

            <h2 className="text-xl font-semibold mb-6 text-yellow-400">
              Update Product
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

              <div className="flex gap-3 pt-4">

                <button
                  onClick={updateProduct}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 py-2 rounded-lg font-semibold"
                >
                  Update
                </button>

                <button
                  onClick={() => setEditModal(false)}
                  className="flex-1 bg-neutral-700 hover:bg-neutral-600 py-2 rounded-lg"
                >
                  Cancel
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}