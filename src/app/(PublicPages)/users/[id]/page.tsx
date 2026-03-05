"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import FollowButton from "@/components/small/FollowButton";

interface Product {
  _id: string;
  title: string;
  slug: string;
  price: number;
  thumbnail?: string;
}

interface UserProfile {
  _id: string;
  name: string;
  username: string;
  image?: string;
  bio?: string;
  website?: string;
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
}

export default function UserProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const router = useRouter();
  const { data: session } = useSession();

const [user, setUser] = useState<UserProfile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  async function loadProfile() {
    const res = await fetch(`/api/users/${id}`);
    const data = await res.json();
    setUser(data.user);
    setProducts(data.products);
  }

  useEffect(() => {
    loadProfile();
  }, [id]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-neutral-500">
        Loading profile...
      </div>
    );
  }

  /* ================= FOLLOW HANDLER ================= */

 function handleFollowClick() {
  const callback = window.location.pathname;
  router.push(`/login?mode=login&callbackUrl=${encodeURIComponent(callback)}`);
}

  function handleFollowChange(isFollowing: boolean) {
  setUser((prev) => {
    if (!prev) return prev;

    return {
      ...prev,
      followersCount: isFollowing
        ? prev.followersCount + 1
        : prev.followersCount - 1,
      isFollowing,
    };
  });
}

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-16">

        {/* ================= PROFILE HEADER ================= */}

        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-10 mb-16">
          <div className="flex flex-col md:flex-row gap-10 md:items-start">

            {/* Avatar */}
            <div className="w-28 h-28 rounded-full bg-neutral-800 border border-neutral-700 overflow-hidden flex items-center justify-center text-4xl font-semibold shrink-0">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                user.name?.[0]?.toUpperCase()
              )}
            </div>

            {/* User Info */}
            <div className="flex-1">

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                    {user.name}
                  </h1>

                  <p className="text-neutral-400 mt-1">
                    @{user.username}
                  </p>
                </div>

                {/* FOLLOW BUTTON LOGIC */}

               {session?.user?.id !== user._id && (
  session ? (
    <FollowButton
      targetUserId={user._id}
      initialIsFollowing={user.isFollowing}
      onFollowChange={handleFollowChange}
    />
  ) : (
    <button
      onClick={handleFollowClick}
      className="px-6 py-2 rounded-lg bg-amber-500 text-black font-medium hover:bg-amber-400 transition"
    >
      Follow
    </button>
  )
)}
              </div>

              {user.bio && (
                <p className="mt-6 text-neutral-300 max-w-3xl leading-relaxed">
                  {user.bio}
                </p>
              )}

              {user.website && (
                <a
                  href={user.website}
                  target="_blank"
                  className="inline-block mt-4 text-sm text-neutral-400 hover:text-white transition"
                >
                  {user.website}
                </a>
              )}

              {/* Stats */}

              <div className="flex gap-10 mt-8 text-sm">

                <div>
                  <span className="text-xl font-semibold">
                    {user.followersCount}
                  </span>
                  <p className="text-neutral-500 text-xs mt-1">
                    Followers
                  </p>
                </div>

                <div>
                  <span className="text-xl font-semibold">
                    {user.followingCount}
                  </span>
                  <p className="text-neutral-500 text-xs mt-1">
                    Following
                  </p>
                </div>

              </div>

            </div>
          </div>
        </div>

        {/* ================= PRODUCTS ================= */}

        <div className="flex items-center justify-between mb-12">

          <h2 className="text-2xl font-semibold tracking-tight">
            Published Components
          </h2>

          <span className="text-sm text-neutral-500">
            {products.length} items
          </span>

        </div>

        {products.length === 0 && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-14 text-center text-neutral-500">
            No published products yet.
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">

          {products.map((p) => (
            <Link
              key={p._id}
              href={`/components/${user.username}/${p.slug}`}
              className="group"
            >
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden transition-all duration-300 hover:border-neutral-600 hover:-translate-y-1">

                {/* Thumbnail */}

                <div className="h-56 overflow-hidden">
                  {p.thumbnail ? (
                    <img
                      src={p.thumbnail}
                      alt={p.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-neutral-800 text-neutral-500">
                      No Image
                    </div>
                  )}
                </div>

                {/* Content */}

                <div className="p-6">

                  <h3 className="text-lg font-semibold line-clamp-1">
                    {p.title}
                  </h3>

                  <div className="flex items-center justify-between mt-4">

                    <span className="text-neutral-300 font-medium">
                      ₹ {p.price}
                    </span>

                    <span className="text-xs text-neutral-500">
                      @{user.username}
                    </span>

                  </div>
                </div>

              </div>
            </Link>
          ))}

        </div>

      </div>
    </div>
  );
}