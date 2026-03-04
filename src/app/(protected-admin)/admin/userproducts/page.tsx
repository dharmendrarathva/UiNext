"use client";

import { useEffect, useState } from "react";

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

  async function loadProducts(filter = "ALL") {
    setLoading(true);

    const res = await fetch(
      `/api/admin/userproducts?status=${filter}`
    );

    const data = await res.json();

    setProducts(data);
    setLoading(false);
  }

  useEffect(() => {
    loadProducts(statusFilter);
  }, [statusFilter]);

  const approve = async (id: string) => {
    await fetch(`/api/admin/userproducts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "APPROVE" }),
    });

    loadProducts(statusFilter);
  };

  const reject = async (id: string) => {
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
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-10">

      <h1 className="text-3xl font-bold mb-8 text-yellow-400">
        Product Moderation
      </h1>

      {/* FILTER BUTTONS */}
      <div className="flex gap-3 mb-8">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setStatusFilter(f)}
            className={`px-4 py-2 rounded-lg border ${
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

      {products.length === 0 && !loading && (
        <p className="text-neutral-500">
          No products found
        </p>
      )}

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {products.map((p) => (
          <div
            key={p._id}
            className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-yellow-400 transition"
          >

            {p.thumbnail && (
              <img
                src={p.thumbnail}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
            )}

            <h3 className="text-xl font-semibold mb-2">
              {p.title}
            </h3>

            <p className="text-neutral-400 text-sm mb-4 line-clamp-3">
              {p.description}
            </p>

    <span
className={`inline-block text-xs px-2 py-1 rounded mb-3
${
p.status === "DRAFT"
? "bg-gray-600"

: p.status === "PENDING"
? "bg-yellow-500 text-black"

: p.status === "APPROVED"
? "bg-green-600"

: p.status === "REJECTED"
? "bg-red-600"

: p.isDeleted
? "bg-purple-600"

: ""
}`}
>
{p.isDeleted ? "ARCHIVED" : p.status}
</span>

            {/* USER INFO */}
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

            {/* ACTION BUTTONS */}
            <div className="flex gap-3">

              <button
                onClick={() => approve(p._id)}
                className="flex-1 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg"
              >
                Approve
              </button>

              <button
                onClick={() => reject(p._id)}
                className="flex-1 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
              >
                Reject
              </button>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}