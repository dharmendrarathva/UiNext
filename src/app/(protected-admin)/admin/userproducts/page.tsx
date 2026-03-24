"use client";

import { useEffect, useState } from "react";
import MiniPreview from "@/components/ProductDisplay/MiniPreview";
import AdminPreview from "@/components/ProductDisplay/AdminPreview";

const filters = [
  "ALL",
  "DRAFT",
  "PENDING",
  "APPROVED",
  "REJECTED",
  "ARCHIVED",
];

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  ////////////////////////////////////////////////////
  // LOAD PRODUCTS
  ////////////////////////////////////////////////////

  async function loadProducts(filter = "ALL") {
    try {
      setLoading(true);

      const res = await fetch(`/api/admin/userproducts?status=${filter}`);

      const data = await res.json();

      setProducts(data || []);
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts(statusFilter);
  }, [statusFilter]);

  ////////////////////////////////////////////////////
  // ACTIONS
  ////////////////////////////////////////////////////

  async function approve(id: string) {
    await fetch(`/api/admin/userproducts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "APPROVE" }),
    });

    loadProducts(statusFilter);
  }

  async function reject(id: string) {
    const reason = prompt("Enter rejection reason");

    if (!reason) return;

    await fetch(`/api/admin/userproducts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "REJECT",
        rejectionReason: reason,
      }),
    });

    loadProducts(statusFilter);
  }

  ////////////////////////////////////////////////////
  // STATUS BADGE
  ////////////////////////////////////////////////////

  function statusBadge(p: any) {
    if (p.isDeleted) return "bg-purple-600";

    switch (p.status) {
      case "APPROVED":
        return "bg-green-600";

      case "PENDING":
        return "bg-yellow-500 text-black";

      case "REJECTED":
        return "bg-red-600";

      default:
        return "bg-gray-600";
    }
  }

  ////////////////////////////////////////////////////
  // UI
  ////////////////////////////////////////////////////

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-10">

      <h1 className="text-3xl font-bold mb-8 text-yellow-400">
        Product Moderation
      </h1>

      {/* FILTERS */}

      <div className="flex gap-3 mb-8 flex-wrap">

        {filters.map((f) => (

          <button
            key={f}
            onClick={() => setStatusFilter(f)}
            className={`px-4 py-2 rounded-lg border text-sm ${
              statusFilter === f
                ? "bg-yellow-500 text-black"
                : "border-neutral-700 hover:border-yellow-500"
            }`}
          >
            {f}
          </button>

        ))}

      </div>

      {loading && (
        <p className="text-neutral-400">Loading products...</p>
      )}

      {!loading && products.length === 0 && (
        <p className="text-neutral-500">No products found</p>
      )}

      {/* PRODUCT GRID */}

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

        {products.map((p) => (

          <div
            key={p._id}
            className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden hover:border-yellow-400 transition flex flex-col"
          >

            {/* MINI PREVIEW */}

            <div className="bg-neutral-950 border-b border-neutral-800">

              <MiniPreview codes={p.codes} />

            </div>

            {/* CONTENT */}

            <div className="p-5 flex flex-col flex-1">

              <h3 className="text-lg font-semibold mb-2">
                {p.title}
              </h3>

              <span className="inline-block bg-yellow-500/20 text-yellow-400 text-xs px-2 py-1 rounded mb-2">
                {p.category?.name || "Uncategorized"}
              </span>

              <span
                className={`inline-block text-xs px-2 py-1 rounded mb-3 ${statusBadge(p)}`}
              >
                {p.isDeleted ? "ARCHIVED" : p.status}
              </span>

              <div className="text-sm text-neutral-500 mb-4">

                <p>
                  Creator:{" "}
                  <span className="text-neutral-300">
                    {p.createdBy?.username}
                  </span>
                </p>

                <p className="text-xs">
                  {p.createdBy?.email}
                </p>

              </div>

              {p.rejectionReason && (
                <p className="text-red-400 text-xs mb-3">
                  Reason: {p.rejectionReason}
                </p>
              )}

              {/* ACTIONS */}

              <div className="flex gap-3 mt-auto">

                <button
                  onClick={() => setSelectedProduct(p)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm"
                >
                  View
                </button>

                <button
                  onClick={() => approve(p._id)}
                  className="flex-1 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm"
                >
                  Approve
                </button>

                <button
                  onClick={() => reject(p._id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm"
                >
                  Reject
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

      {/* ADMIN PREVIEW */}

      {selectedProduct && (

        <AdminPreview
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onApprove={approve}
          onReject={reject}
        />

      )}

    </div>
  );
}