"use client";

import { useEffect, useState } from "react";

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/admin/userproducts")
      .then((res) => res.json())
      .then(setProducts);
  }, []);

  const approve = async (id: string) => {
    await fetch(`/api/admin/userproducts/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ action: "APPROVE" }),
    });

    location.reload();
  };

  const reject = async (id: string) => {
    const reason = prompt("Rejection reason");

    await fetch(`/api/admin/userproducts/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        action: "REJECT",
        rejectionReason: reason,
      }),
    });

    location.reload();
  };

  return (
    <div>
      <h1>Pending Products</h1>

      {products.map((p) => (
        <div key={p._id}>
          <h3>{p.title}</h3>
          <p>{p.description}</p>

          <p>
            By: {p.createdBy?.username} ({p.createdBy?.email})
          </p>

          <button onClick={() => approve(p._id)}>
            Approve
          </button>

          <button onClick={() => reject(p._id)}>
            Reject
          </button>
        </div>
      ))}
    </div>
  );
}