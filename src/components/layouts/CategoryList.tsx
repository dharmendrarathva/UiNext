"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

export default function CategoryList() {

  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  //////////////////////////////////////////////////////
  // HYDRATION FIX
  //////////////////////////////////////////////////////

  useEffect(() => {
    setMounted(true);
  }, []);

  //////////////////////////////////////////////////////
  // FETCH CATEGORIES
  //////////////////////////////////////////////////////

  useEffect(() => {

    if (!mounted) return;

    const loadCategories = async () => {

      try {

const res = await fetch("/api/categories");
        if (!res.ok) return;
        
        const data = await res.json();

        setCategories(data);

      } catch (err) {

        console.error("Category fetch error:", err);

      }

    };

    loadCategories();

  }, [mounted]);

  //////////////////////////////////////////////////////
  // WAIT FOR CLIENT
  //////////////////////////////////////////////////////

  if (!mounted) {
    return null;
  }

  //////////////////////////////////////////////////////
  // UI
  //////////////////////////////////////////////////////

  return (

    <div className="relative">

      <button
        onClick={() => setOpen(!open)}
        className="hover:text-white transition"
      >
        Categories
      </button>

      {open && (

        <div className="absolute top-8 left-0 w-56 bg-neutral-900 border border-neutral-800 rounded-xl shadow-lg p-2">

          {categories.length === 0 && (
            <div className="text-sm text-neutral-400 px-3 py-2">
              No categories
            </div>
          )}

          {categories.map((cat) => (

            <Link
              key={cat._id}
              href={`/${cat.slug}`}
              className="block px-3 py-2 text-sm rounded-lg hover:bg-neutral-800 transition"
              onClick={() => setOpen(false)}
            >
              {cat.name}
            </Link>

          ))}

        </div>

      )}

    </div>

  );

}