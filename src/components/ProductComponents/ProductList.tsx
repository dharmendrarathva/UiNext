"use client";

import ProductCard from "@/components/ProductComponents/ProductCard";
import MiniPreview from "@/components/ProductDisplay/MiniPreview";

import { Category } from "@/types/Category";
import { Product as ProductCardProduct } from "@/types/Product";

// ✅ Icons
import { FaRegEdit, FaCloudUploadAlt } from "react-icons/fa";
import { MdDelete, MdDrafts } from "react-icons/md";

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
  // BUTTON STYLES
  ////////////////////////////////////////////

  const primaryBtn =
    "w-full flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white " +
    "bg-gradient-to-r from-blue-600 to-indigo-600 " +
    "hover:from-blue-500 hover:to-indigo-500 " +
    "shadow-md hover:shadow-lg active:scale-[0.97] transition";

  const secondaryBtn =
    "flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium " +
    "bg-neutral-800 text-neutral-200 border border-neutral-700 " +
    "hover:bg-neutral-700 hover:border-neutral-600 " +
    "active:scale-[0.97] transition";

  const dangerBtn =
    "flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-white " +
    "bg-red-600/90 hover:bg-red-600 " +
    "shadow-sm hover:shadow-md active:scale-[0.97] transition";

  const disabledBtn =
    "flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium " +
    "bg-neutral-800 text-neutral-500 cursor-not-allowed";

  ////////////////////////////////////////////
  // UI
  ////////////////////////////////////////////

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6">

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
              className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 
              transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-neutral-700"
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
                    className={`text-xs px-3 py-1 rounded-full flex items-center gap-1 ${getStatusStyle(
                      p.status
                    )}`}
                  >
                    {p.status === "DRAFT" && <MdDrafts size={14} />}
                    {p.status}
                  </span>
                </div>

                {/* Rejection Message */}
                {p.status === "REJECTED" && (
                  <div className="mb-3 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                    {p.rejectionReason}
                  </div>
                )}

                {/* Submit Button */}
                

                {/* Actions */}
<div className="mt-auto pt-4 flex flex-col gap-3">

 

  <div className="flex gap-3">
    <button
      disabled={p.status === "APPROVED"}
      onClick={() => onEdit(p)}
      className={
        p.status === "APPROVED"
          ? disabledBtn
          : secondaryBtn
      }
    >
      <FaRegEdit size={14} />
      Edit
    </button>

    <button
      onClick={() => onDelete(p._id)}
      className={dangerBtn}
    >
      <MdDelete size={16} />
      Delete
    </button>
  </div>

   {/* PRIMARY ACTION */}
  {p.status === "DRAFT" && (
    <button
      onClick={() => onSubmit(p._id)}
      className={primaryBtn}
    >
      <FaCloudUploadAlt size={16} />
      Submit for Review
    </button>
  )}

</div>

              </div>
            </div>
          );
        })
      )}
    </div>
  );
}