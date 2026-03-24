"use client";

import ProductCard from "@/components/ProductComponents/ProductCard";
import MiniPreview from "@/components/ProductDisplay/MiniPreview";

import { Category } from "@/types/Category";
import { Product as ProductCardProduct } from "@/types/Product";

interface Product {
  _id: string;
  title: string;
  status: string;
  category: string | Category;
  rejectionReason?: string;

  codes?: {
    html?: string;
    css?: string;
    js?: string;
    react?: string;
    next?: string;
    tailwind?: string;
  };
}

interface Props {
  filter: string;
  products: Product[];
  publishedProducts: ProductCardProduct[];
  onEdit: (p: Product) => void;
  onDelete: (id: string) => void;
  onSubmit: (id: string) => void;
}

export default function ProductList({
  filter,
  products,
  publishedProducts,
  onEdit,
  onDelete,
  onSubmit,
}: Props) {

  ////////////////////////////////////////////
  // STATUS STYLE
  ////////////////////////////////////////////

  const getStatusStyle = (status: string) => {
    const styles: Record<string, string> = {
      APPROVED:
        "bg-green-500/10 text-green-400 border border-green-500/30",
      REJECTED:
        "bg-red-500/10 text-red-400 border border-red-500/30",
      DRAFT:
        "bg-neutral-700 text-neutral-300 border border-neutral-600",
      PENDING:
        "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30",
    };

    return styles[status] || styles.PENDING;
  };

  ////////////////////////////////////////////
  // IMPLEMENTATION TYPE
  ////////////////////////////////////////////

  const getImplementation = (codes?: Product["codes"]) => {
    if (!codes) return null;

    if (codes.next) return "Next.js";
    if (codes.react) return "React";
    if (codes.tailwind) return "Tailwind";
    if (codes.html) return "HTML";

    return null;
  };

  ////////////////////////////////////////////
  // UI
  ////////////////////////////////////////////

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6">

      {/* Published Products */}

      {filter === "MY_PUBLISHED" ? (
        publishedProducts.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))
      ) : (
        products.map((p) => {

          const implementation = getImplementation(p.codes);

          return (
            <div
              key={p._id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 transition hover:-translate-y-1 hover:shadow-xl hover:border-neutral-700"
            >

              {/* Preview */}

              <div className="aspect-video bg-neutral-950 border-b border-neutral-800">
                <MiniPreview codes={p.codes} />
              </div>

              {/* Content */}

              <div className="flex flex-col flex-1 p-5">

                {/* Title */}

                <h3 className="text-lg font-semibold text-white mb-3 line-clamp-1">
                  {p.title}
                </h3>

                {/* Tags */}

                <div className="flex flex-wrap gap-2 mb-3">

                  {implementation && (
                    <span className="text-xs px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30">
                      {implementation}
                    </span>
                  )}

                  <span
                    className={`text-xs px-3 py-1 rounded-full ${getStatusStyle(
                      p.status
                    )}`}
                  >
                    {p.status}
                  </span>
                  

                </div>

                {/* Rejection Message */}

                {p.status === "REJECTED" && (
                  <div className="mb-3 rounded-lg border border-red-500/30 bg-red-500/10 p-2 text-sm text-red-400">
                    {p.rejectionReason}
                  </div>
                )}

                {/* Submit Button */}

                {p.status === "DRAFT" && (
                  <button
                    onClick={() => onSubmit(p._id)}
                    className="mb-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium transition hover:bg-blue-700"
                  >
                    Submit for Review
                  </button>
                )}

                {/* Actions */}

                <div className="mt-auto flex gap-3 pt-4">

                  <button
                    disabled={p.status === "APPROVED"}
                    onClick={() => onEdit(p)}
                    className={`flex-1 rounded-lg px-4 py-2 text-sm transition ${
                      p.status === "APPROVED"
                        ? "cursor-not-allowed bg-neutral-800 text-neutral-500"
                        : "bg-neutral-800 hover:bg-neutral-700"
                    }`}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => onDelete(p._id)}
                    className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm transition hover:bg-red-700"
                  >
                    Delete
                  </button>

                </div>

              </div>

            </div>
          );
        })
      )}
    </div>
  );
}