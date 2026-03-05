"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface UserItem {
  _id: string;
  name: string;
  username: string;
  image?: string | null;
}

export default function FollowList({
  userId,
  type,
  count,
}: {
  userId: string;
  type: "followers" | "following";
  count: number;
}) {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(false);

async function loadUsers() {
  if (users.length > 0) return;

  try {
    setLoading(true);

    const res = await fetch(
  `/api/users/${userId}/follows?type=${type}`,
  { cache: "no-store" }
);

    const data = await res.json();

    setUsers(data || []);
  } finally {
    setLoading(false);
  }
}

useEffect(() => {
  if (open && users.length === 0) {
    loadUsers();
  }
}, [open]);

  return (
    <>
      {/* TRIGGER */}
      <button
        onClick={() => setOpen(true)}
        className="text-neutral-400 hover:text-white transition"
      >
        <span className="font-semibold text-white">{count}</span> {type}
      </button>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setOpen(false)}
          />

          {/* Modal Box */}
          <div className="relative bg-neutral-900 border border-neutral-800 w-[420px] rounded-2xl shadow-2xl overflow-hidden">

            {/* HEADER */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
              <h2 className="text-lg font-semibold capitalize">
                {type}
              </h2>

              <button
                onClick={() => setOpen(false)}
                className="text-neutral-400 hover:text-white transition"
              >
                ✕
              </button>
            </div>

            {/* BODY */}
            <div className="max-h-[420px] overflow-y-auto px-3 py-2">

              {loading && (
                <p className="text-neutral-400 text-sm py-6 text-center">
                  Loading...
                </p>
              )}

              {!loading && users.length === 0 && (
                <p className="text-neutral-500 text-sm py-6 text-center">
                  No users found
                </p>
              )}

              <div className="space-y-1">
                {users.map((u) => (
                  <Link
                    key={u._id}
                    href={`/users/${u._id}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-800 transition cursor-pointer"
                  >
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-neutral-800 overflow-hidden flex items-center justify-center text-sm font-semibold">
                      {u.image ? (
                        <img
                          src={u.image}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        u.username?.[0]?.toUpperCase()
                      )}
                    </div>

                    {/* User info */}
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {u.name || "User"}
                      </span>
                      <span className="text-sm text-neutral-400">
                        @{u.username}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}