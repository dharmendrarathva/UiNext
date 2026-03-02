"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import Image from "next/image";

interface Props {
  user: {
    email: string;
    image?: string | null;
    name?: string;
    username?: string;
    bio?: string;
    website?: string;
    followersCount?: number;
    followingCount?: number;
    createdAt?: string;
    updatedAt?: string;
  };
}

export default function ProfileForm({ user }: Props) {
  const [username, setUsername] = useState(user.username ?? "");
  const [bio, setBio] = useState(user.bio ?? "");
  const [website, setWebsite] = useState(user.website ?? "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, bio, website }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Error updating profile");
      } else {
        setMessage("Profile updated successfully");
      }
    } catch {
      setMessage("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="space-y-10 max-w-6xl">

   {/* ================= ACCOUNT OVERVIEW ================= */}
<div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-neutral-950 via-neutral-940 to-neutral-900 p-10 shadow-2xl">

  {/* Header */}
  <div className="flex items-center justify-between mb-10">
    <h2 className="text-2xl font-semibold text-white tracking-tight">
      Account Overview
    </h2>
    <span className="text-xs px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
      Active
    </span>
  </div>

  {/* Profile Section */}
  <div className="flex items-center gap-6 mb-10">
    {user.image && (
      <Image
        src={user.image}
        alt="Profile"
        width={96}
        height={96}
        className="rounded-full ring-2 ring-yellow-500/30 shadow-lg"
      />
    )}

    <div>
      <p className="text-2xl font-semibold text-white leading-tight">
        {user.name}
      </p>
      <p className="text-neutral-400 text-sm mt-1">
        {user.email}
      </p>
    </div>
  </div>

  {/* Stats Grid */}
  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

    {/* Followers */}
    <div className="group rounded-2xl  p-6 hover:border-yellow-500/40 transition">
      <p className="text-neutral-200 text-sm mb-2">Followers</p>
      <p className="text-3xl font-bold text-white/40">
        {user.followersCount}
      </p>
    </div>

    {/* Following */}
    <div className="group rounded-2xl  p-6 hover:border-yellow-500/40 transition">
      <p className="text-neutral-200 text-sm mb-2">Following</p>
      <p className="text-3xl font-bold text-white/40">
        {user.followingCount}
      </p>
    </div>

    {/* Created */}
    <div className="group rounded-2xl  p-6">
      <p className="text-neutral-200 text-sm mb-2">Account Created</p>
      <p className="text-lg font-medium text-white/50">
        {user.createdAt
          ? new Date(user.createdAt).toLocaleDateString()
          : "-"}
      </p>
    </div>

    {/* Updated */}
    <div className="group rounded-2xl  p-6">
      <p className="text-neutral-200 text-sm mb-2">Last Updated</p>
      <p className="text-lg font-medium text-white/50">
        {user.updatedAt
          ? new Date(user.updatedAt).toLocaleDateString()
          : "-"}
      </p>
    </div>

  </div>

</div>
      {/* ================= SECOND CARD (EDITABLE) ================= */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-8">
        <h2 className="text-yellow-400 font-semibold text-lg mb-6">
          Edit Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          <div>
            <label className="block text-sm text-neutral-400 mb-2">
              Username
            </label>
            <input
              value={username}
              onChange={(e) =>
                setUsername(e.target.value.toLowerCase())
              }
              className="w-full bg-black border border-neutral-800 px-4 py-3 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm text-neutral-400 mb-2">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              maxLength={300}
              className="w-full bg-black border border-neutral-800 px-4 py-3 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm text-neutral-400 mb-2">
              Website
            </label>
            <input
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full bg-black border border-neutral-800 px-4 py-3 rounded-lg"
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-yellow-500 hover:bg-yellow-600 transition px-8 py-3 rounded-lg font-semibold text-black"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>

            {message && (
              <span className="text-neutral-400 text-sm">
                {message}
              </span>
            )}
          </div>

        </form>
      </div>

      {/* ================= BOTTOM CARD (LOGOUT) ================= */}
      <div className="bg-red-950 border border-neutral-700 rounded-2xl p-8">
        <h2 className="text-red-400 font-semibold text-lg mb-4">
          Danger Zone
        </h2>

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="bg-red-600 hover:bg-red-700 transition px-6 py-3 rounded-lg font-medium"
        >
          Logout
        </button>
      </div>

    </div>
  );
}