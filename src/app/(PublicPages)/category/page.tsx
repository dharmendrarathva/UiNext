"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
}

export default function CategoriesPage() {

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  //////////////////////////////////////////////////////
  // FETCH
  //////////////////////////////////////////////////////

  useEffect(() => {

    const loadCategories = async () => {

      try {

        const res = await fetch("/api/categories");

        if (!res.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data = await res.json();

        setCategories(data);

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }

    };

    loadCategories();

  }, []);

  //////////////////////////////////////////////////////
  // LOADING
  //////////////////////////////////////////////////////

  if (loading) {
    return (
      <div className="p-10 text-center">
        Loading categories...
      </div>
    );
  }

  //////////////////////////////////////////////////////
  // UI
  //////////////////////////////////////////////////////

  return (

    <div className="max-w-7xl mx-auto px-6 py-12">

      <h1 className="text-3xl font-bold mb-10">
        Browse Categories
      </h1>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

        {categories.map((cat) => (

          <Link
            key={cat._id}
            href={`/${cat.slug}`}
            className="border border-neutral-800 bg-neutral-900 p-6 rounded-xl hover:border-neutral-600 transition"
          >

            <h2 className="text-lg font-semibold mb-2">
              {cat.icon} {cat.name}
            </h2>

            <p className="text-sm text-neutral-400">
              {cat.description}
            </p>

          </Link>

        ))}

      </div>

    </div>

  );

}