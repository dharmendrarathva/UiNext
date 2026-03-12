import ProductCard from "@/components/ProductComponents/ProductCard";
import { Category } from "@/types/Category";
import { Product as ProductCardProduct } from "@/types/Product";

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  status: string;
  category: string | Category;
  rejectionReason?: string;
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

  function statusBadge(status: string) {
    if (status === "APPROVED")
      return "bg-green-500/20 text-green-400";
    if (status === "REJECTED")
      return "bg-red-500/20 text-red-400";
    if (status === "DRAFT")
      return "bg-neutral-700 text-neutral-300";

    return "bg-yellow-500/20 text-yellow-400";
  }

  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

      {filter === "MY_PUBLISHED" ? (

        publishedProducts.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))

      ) : (

        products.map((p) => (

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

            <span
              className={`text-xs px-3 py-1 rounded-full ${statusBadge(
                p.status
              )}`}
            >
              {p.status}
            </span>

            {p.status === "REJECTED" && (
              <div className="mt-3 text-sm text-red-400">
                Reason: {p.rejectionReason}
              </div>
            )}

            {p.status === "DRAFT" && (
              <button
                onClick={() => onSubmit(p._id)}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm mt-3"
              >
                Submit for Review
              </button>
            )}

            <div className="flex flex-wrap gap-3 mt-5">

              <button
                disabled={p.status === "APPROVED"}
                onClick={() => onEdit(p)}
                className={`flex-1 px-3 py-2 rounded-lg text-sm ${
                  p.status === "APPROVED"
                    ? "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                    : "bg-neutral-700 hover:bg-neutral-600"
                }`}
              >
                Edit
              </button>

              <button
                onClick={() => onDelete(p._id)}
                className="flex-1 bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg text-sm"
              >
                Delete
              </button>

            </div>

          </div>

        ))

      )}

    </div>
  );
}