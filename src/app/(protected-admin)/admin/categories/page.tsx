"use client";

import { useEffect, useState } from "react";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    description: "",
    icon: "",
  });

  const [editingId, setEditingId] = useState<string | null>(null);

  // FETCH CATEGORIES
  async function fetchCategories() {
    const res = await fetch("/api/admin/cat-management");
    const data = await res.json();
    setCategories(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  // CREATE OR UPDATE CATEGORY
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const method = editingId ? "PUT" : "POST";

    const url = editingId
      ? `/api/admin/cat-management/${editingId}`
      : "/api/admin/cat-management";

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    setForm({
      name: "",
      description: "",
      icon: "",
    });

    setEditingId(null);

    fetchCategories();
  }

  // EDIT
  function handleEdit(cat: Category) {
    setForm({
      name: cat.name,
      description: cat.description || "",
      icon: cat.icon || "",
    });

    setEditingId(cat._id);
  }

  // DELETE
  async function handleDelete(id: string) {
    if (!confirm("Delete this category?")) return;

    await fetch(`/api/admin/cat-management/${id}`, {
      method: "DELETE",
    });

    fetchCategories();
  }

  return (
    <div className="max-w-5xl mx-auto py-10 space-y-10">
      <h1 className="text-3xl font-bold">Category Management</h1>

      {/* CREATE / UPDATE FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-4"
      >
        <h2 className="text-xl font-semibold">
          {editingId ? "Update Category" : "Create Category"}
        </h2>

        <input
          type="text"
          placeholder="Category name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          required
          className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2"
        />

        <input
          type="text"
          placeholder="Icon URL"
          value={form.icon}
          onChange={(e) =>
            setForm({ ...form, icon: e.target.value })
          }
          className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2"
        />

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
          className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2"
        />

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
        >
          {editingId ? "Update Category" : "Create Category"}
        </button>
      </form>

      {/* CATEGORY LIST */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-6">
          All Categories
        </h2>

        {loading ? (
          <p>Loading...</p>
        ) : categories.length === 0 ? (
          <p>No categories found.</p>
        ) : (
          <div className="space-y-4">
            {categories.map((cat) => (
              <div
                key={cat._id}
                className="flex justify-between items-center border border-neutral-800 rounded-lg p-4"
              >
                <div>
                  <p className="font-semibold">{cat.name}</p>
                  <p className="text-sm text-neutral-400">
                    /{cat.slug}
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => handleEdit(cat)}
                    className="text-yellow-400"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(cat._id)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}