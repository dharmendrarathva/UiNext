"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Rocket } from "lucide-react";
import PreviewFrame from "./PreviewFrame";
import { Product } from "@/types/Product";

// Same 8-col x 3-row layout as the reference screenshot.
const GRID_SLOTS = 24;

const PRODUCTS_API_URL =
  process.env.NEXT_PUBLIC_PRODUCTS_API_URL ?? "/api/products";
const CATEGORIES_API_URL = "/api/categories";

type Category = {
  _id: string;
  name: string;
  slug: string;
  icon?: string;
};

//////////////////////////////////////////////////////////
// Fuzzy letter-by-letter matcher
// - exact substring match wins first (best score)
// - otherwise falls back to "do the typed letters appear in
//   order somewhere in the name" (so typos / partial words like
//   "btn" or "bttn" still surface "Buttons")
//////////////////////////////////////////////////////////

function matchScore(name: string, query: string): number | null {
  const n = name.toLowerCase();
  const q = query.trim().toLowerCase();

  if (!q) return null;

  if (n.includes(q)) {
    // closer to the start of the name = better score
    return 1000 - n.indexOf(q);
  }

  // subsequence / letter-by-letter fuzzy match
  let ni = 0;
  let matched = 0;
  let firstIdx = -1;
  let lastIdx = -1;

  for (let qi = 0; qi < q.length; qi++) {
    const ch = q[qi];
    const found = n.indexOf(ch, ni);
    if (found === -1) continue;
    if (firstIdx === -1) firstIdx = found;
    lastIdx = found;
    ni = found + 1;
    matched++;
  }

  if (matched === 0) return null;

  // require most of the typed letters to actually show up
  if (matched / q.length < 0.6) return null;

  const spread = lastIdx - firstIdx + 1;
  // tighter matches (letters close together) score higher
  return (matched / q.length) * 100 - spread;
}

export default function Hero() {
  const router = useRouter();

  // products (preview grid)
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // categories (search)
  const [categories, setCategories] = useState<Category[]>([]);
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(PRODUCTS_API_URL, {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!res.ok) {
          setError(`Request failed: ${res.status}`);
          setProducts([]);
          return;
        }

        const data = await res.json();
        const list: Product[] = Array.isArray(data) ? data : data.products ?? [];
        setProducts(list);
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        console.warn("Hero: could not load products:", err);
        setError("Could not reach the products API.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    async function loadCategories() {
      try {
        const res = await fetch(CATEGORIES_API_URL, {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!res.ok) return;
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        console.warn("Hero: could not load categories:", err);
      }
    }

    loadProducts();
    loadCategories();
    return () => controller.abort();
  }, []);

  const gridItems = products.slice(0, GRID_SLOTS);

  const matches = useMemo(() => {
    if (!query.trim()) return [];

    return categories
      .map((cat) => ({ cat, score: matchScore(cat.name, query) }))
      .filter((m): m is { cat: Category; score: number } => m.score !== null)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map((m) => m.cat);
  }, [categories, query]);

  function goToTopMatch() {
    if (matches.length > 0) {
      router.push(`/${matches[0].slug}`);
    }
  }

  return (
    <section className="relative w-full  py-16 px-10 overflow-hidden">
      {/* Search bar overlay */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 w-full max-w-md px-4">
        <div className="relative">
          <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 shadow-2xl">
            <Search className="w-4 h-4 text-neutral-500 shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 120)}
              onKeyDown={(e) => {
                if (e.key === "Enter") goToTopMatch();
              }}
              placeholder="Search for components, styles, creators..."
              className="bg-transparent outline-none text-sm text-neutral-200 placeholder:text-neutral-500 flex-1 min-w-0"
            />
            <button
              onClick={goToTopMatch}
              className="bg-indigo-600 hover:bg-indigo-500 transition text-white text-sm font-medium px-4 py-1.5 rounded-lg shrink-0"
            >
              Search
            </button>
          </div>

          {/* Category matches dropdown */}
          {focused && query.trim() && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden">
              {matches.length > 0 ? (
                matches.map((cat) => (
                  <Link
                    key={cat._id}
                    href={`/${cat.slug}`}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-neutral-300 hover:bg-neutral-800 transition"
                  >
                    {cat.icon && <span className="text-base">{cat.icon}</span>}
                    <span>{cat.name}</span>
                  </Link>
                ))
              ) : (
                <div className="px-4 py-2.5 text-sm text-neutral-500">
                  No matching category.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black z-10" />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-px bg-neutral-800/40 mt-16">
        {loading &&
          Array.from({ length: GRID_SLOTS }).map((_, i) => (
            <div
              key={`skeleton-${i}`}
              className="h-44 md:h-56 bg-neutral-900/60 border border-neutral-800/60 animate-pulse"
            />
          ))}

        {!loading && error && (
          <div className="col-span-full flex items-center justify-center h-44 text-neutral-500 text-sm px-4 text-center">
            {error} — check the API URL / CORS config.
          </div>
        )}

        {!loading && !error && gridItems.length === 0 && (
          <div className="col-span-full flex items-center justify-center h-44 text-neutral-500 text-sm">
            No components found.
          </div>
        )}

        {!loading &&
          !error &&
          gridItems.map((product) => (
            <div
              key={product._id}
              className="h-44 md:h-56 bg-neutral-900 border border-neutral-800/60 overflow-hidden"
            >
              <PreviewFrame codes={product.codes} />
            </div>
          ))}
      </div>

      {/* CTA */}
      <div className="relative z-20 flex justify-center -mt-8">
      <Link
  href="/allproducts"
  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 transition text-white text-sm font-semibold px-6 py-3 rounded-xl shadow-2xl"
>
  <Rocket className="w-4 h-4" /> Browse all elements
</Link>
      </div>
    </section>
  );
}