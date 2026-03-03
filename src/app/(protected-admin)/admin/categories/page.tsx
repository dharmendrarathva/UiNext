"use client";

import { useEffect, useState } from "react";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const API_BASE = "/api/admin/categories";

  const fetchCategories = async () => {
    const res = await fetch(API_BASE);
    const data = await res.json();
    setCategories(data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  /* ================= CREATE ================= */

  const handleCreate = async () => {
    if (!form.name) return;

    await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setForm({ name: "", description: "" });
    fetchCategories();
  };

  /* ================= UPDATE ================= */

  const handleUpdate = async () => {
    if (!editingId) return;

    await fetch(`${API_BASE}/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setIsModalOpen(false);
    setEditingId(null);
    setForm({ name: "", description: "" });
    fetchCategories();
  };

  /* ================= DELETE ================= */

  const handleDelete = async (id: string) => {
    await fetch(`${API_BASE}/${id}`, {
      method: "DELETE",
    });
    fetchCategories();
  };

  /* ================= OPEN EDIT MODAL ================= */

  const openEditModal = (category: Category) => {
    setEditingId(category._id);
    setForm({
      name: category.name,
      description: category.description || "",
    });
    setIsModalOpen(true);
  };

  return (
    <div className="p-10 text-white max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Manage Categories</h1>

      {/* ================= CREATE FORM ================= */}
      <div className="bg-neutral-900 p-6 rounded-xl mb-10">
        <h2 className="text-xl font-semibold mb-4">Create Category</h2>

        <input
          type="text"
          placeholder="Category Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          className="w-full p-3 mb-4 rounded bg-neutral-800 border border-neutral-700"
        />

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
          className="w-full p-3 mb-4 rounded bg-neutral-800 border border-neutral-700"
        />

        <button
          onClick={handleCreate}
          className="px-6 py-2 bg-amber-500 text-black rounded-lg hover:bg-amber-400 transition"
        >
          Create
        </button>
      </div>

      {/* ================= CATEGORY LIST ================= */}
      <div className="space-y-4">
        {categories.map((cat) => (
          <div
            key={cat._id}
            className="flex items-center justify-between bg-neutral-900 p-4 rounded-xl"
          >
            <div>
              <p className="font-semibold">{cat.name}</p>
              <p className="text-sm text-neutral-400">
                /category/{cat.slug}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => openEditModal(cat)}
                className="px-4 py-1 text-sm bg-blue-600 rounded hover:bg-blue-500"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(cat._id)}
                className="px-4 py-1 text-sm bg-red-600 rounded hover:bg-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ================= EDIT MODAL ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-neutral-900 w-full max-w-md p-6 rounded-2xl shadow-2xl border border-neutral-700">
            <h2 className="text-xl font-semibold mb-6">
              Update Category
            </h2>

            <input
              type="text"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className="w-full p-3 mb-4 rounded bg-neutral-800 border border-neutral-700"
            />

            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full p-3 mb-6 rounded bg-neutral-800 border border-neutral-700"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingId(null);
                }}
                className="px-4 py-2 bg-neutral-700 rounded hover:bg-neutral-600"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-amber-500 text-black rounded hover:bg-amber-400"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}