// import { connectDB } from "@/lib/db";
// import { User } from "@/models/User";
// import { Follow } from "@/models/Follow";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
// import { notFound } from "next/navigation";
// import ProfileView from "./profile-view";

// interface Props {
//   params: Promise<{ id: string }>;
// }

// export default async function PublicProfile({ params }: Props) {
//   const { id } = await params; // ✅ unwrap params first

//   await connectDB();

//   const session = await getServerSession(authOptions);
//   const currentUserId = session?.user?.id;

//   const user = await User.findOne({
//     _id: id,
//     isDeleted: false,
//     isBlocked: false,
//   })
//     .select("name username image bio website followersCount")
//     .lean();

//   if (!user) return notFound();

//   let isFollowing = false;

//   if (currentUserId) {
//     const follow = await Follow.findOne({
//       follower: currentUserId,
//       following: id,
//     });

//     isFollowing = !!follow;
//   }

//  return (
//   <ProfileView
//     user={{
//       _id: user._id.toString(),
//       name: user.name ?? "",          // ✅ add this
//       username: user.username,
//       image: user.image ?? null,
//       bio: user.bio ?? "",
//       website: user.website ?? "",
//       followersCount: user.followersCount ?? 0,
//       isFollowing,
//     }}
//     currentUserId={currentUserId}
//   />
// );
// }



"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
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
}

export default function UserProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

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

  if (!user)
    return (
      <div className="p-10 text-center text-neutral-400">
        Loading profile...
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-10 text-white">

      {/* USER HEADER */}

      <div className="flex items-center gap-6 mb-10">

        <div className="w-20 h-20 rounded-full bg-neutral-700 overflow-hidden flex items-center justify-center text-2xl font-bold">
          {user.image ? (
            <img
              src={user.image}
              className="w-full h-full object-cover"
            />
          ) : (
            user.name?.[0]?.toUpperCase()
          )}
        </div>

        <div className="flex-1">
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-neutral-400">@{user.username}</p>

          {user.bio && (
            <p className="mt-2 text-neutral-300">
              {user.bio}
            </p>
          )}

          {user.website && (
            <a
              href={user.website}
              target="_blank"
              className="text-blue-400 text-sm"
            >
              {user.website}
            </a>
          )}

          <div className="flex gap-4 mt-2 text-sm text-neutral-400">
            <span>{user.followersCount} followers</span>
            <span>{user.followingCount} following</span>
          </div>
        </div>

        <FollowButton
          targetUserId={user._id}
          initialIsFollowing={false}
        />
      </div>

      {/* PRODUCTS */}

      <h2 className="text-xl font-semibold mb-6">
        Published Components
      </h2>

      {products.length === 0 && (
        <p className="text-neutral-500">
          No published products yet.
        </p>
      )}

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

        {products.map((p) => (
          <Link
            key={p._id}
            href={`/components/${user.username}/${p.slug}`}
            className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 hover:border-yellow-400"
          >
            {p.thumbnail && (
              <img
                src={p.thumbnail}
                className="w-full h-36 object-cover rounded mb-3"
              />
            )}

            <h3 className="font-semibold">
              {p.title}
            </h3>

            <p className="text-sm text-neutral-400 mt-1">
              ₹ {p.price}
            </p>
          </Link>
        ))}

      </div>
    </div>
  );
}