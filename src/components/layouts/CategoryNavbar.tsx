"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

export default function CategoryNavbar({
  categories,
}: {
  categories: Category[];
}) {

  const pathname = usePathname();

  return (
    <nav className="sticky top-16 z-40 w-full border-b border-neutral-800 bg-neutral-900/90 backdrop-blur">

      <div className="max-w-7xl mx-auto px-6">

<div className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-hide">
          <Link
            href="/"
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition
            ${
              pathname === "/"
                ? "bg-neutral-800 text-white"
                : "text-neutral-400 hover:text-white hover:bg-neutral-800"
            }`}
          >
            All
          </Link>

          {categories.map((cat) => {

            const active = pathname === `/${cat.slug}`;

            return (
              <Link
                key={cat._id}
                href={`/${cat.slug}`}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition
                ${
                  active
                    ? "bg-neutral-800 text-white"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                }`}
              >
                {cat.name}
              </Link>
            );
          })}

        </div>

      </div>

    </nav>
  );
}