"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import Image from "next/image";

/* ================= TYPES ================= */

type NotificationType = "WARNING" | "INFO" | "BLOCK_NOTICE";

interface NotificationItem {
  _id: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string | null;
}

interface UserData {
  email: string;
  image?: string | null;
  name?: string;
  username?: string;
  bio?: string;
  website?: string;
  followersCount?: number;
  followingCount?: number;
  createdAt?: string | null;
  updatedAt?: string | null;
  isBlocked?: boolean;
  blockReason?: string | null;
  notifications?: NotificationItem[];
}

interface Props {
  user: UserData;
}

/* ================= COMPONENT ================= */

export default function ProfileForm({ user }: Props) {
  const [username, setUsername] = useState(user.username ?? "");
  const [bio, setBio] = useState(user.bio ?? "");
  const [website, setWebsite] = useState(user.website ?? "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [visibleCount, setVisibleCount] = useState(3);

  /* ================= PROFILE UPDATE ================= */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim().toLowerCase(),
          bio: bio.trim(),
          website: website.trim(),
        }),
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

  /* ================= HELPERS ================= */

  const formatDate = (date?: string | null) =>
    date ? date.split("T")[0] : "-";

  const getNotificationStyle = (type: NotificationType) => {
    switch (type) {
      case "WARNING":
        return "bg-neutral-600/10 border-neutral-600/30 text-neutral-100";
      case "BLOCK_NOTICE":
        return "bg-red-600/10 border-red-600/30 text-red-400";
      default:
        return "border-white/40 text-green-600";
    }
  };

  /* ================= UI ================= */

  return (
    <div className="space-y-10 max-w-6xl">
      {/* ================= ACCOUNT OVERVIEW ================= */}
      <section className="rounded-3xl border border-white/10 bg-neutral-950 p-10 shadow-xl">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-semibold">Account Overview</h2>

          <span
            className={`text-xs px-3 py-1 rounded-full border ${
              user.isBlocked
                ? "bg-red-600/10 text-red-400 border-red-600/30"
                : "bg-green-600/10 text-green-400 border-green-600/30"
            }`}
          >
            {user.isBlocked ? "Blocked" : "Active"}
          </span>
        </div>

        <div className="flex items-center gap-6 mb-10">
          {user.image && (
            <Image
              src={user.image}
              alt="Profile"
              width={96}
              height={96}
              className="rounded-full"
            />
          )}

          <div>
            <p className="text-2xl font-semibold">{user.name}</p>
            <p className="text-neutral-400 text-sm">{user.email}</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Stat label="Followers" value={user.followersCount ?? 0} />
          <Stat label="Following" value={user.followingCount ?? 0} />
          <Stat label="Created" value={formatDate(user.createdAt)} />
          <Stat label="Updated" value={formatDate(user.updatedAt)} />
        </div>
      </section>

      {/* ================= EDIT PROFILE ================= */}
      <section className="bg-neutral-950 border border-neutral-800 rounded-2xl p-8">
        <h2 className="text-yellow-400 font-semibold text-lg mb-6">
          Edit Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input label="Username" value={username} onChange={setUsername} />
          <Textarea label="Bio" value={bio} onChange={setBio} />
          <Input label="Website" value={website} onChange={setWebsite} />

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-yellow-500 hover:bg-yellow-600 px-8 py-3 rounded-lg font-semibold text-black"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>

            {message && (
              <span className="text-neutral-400 text-sm">{message}</span>
            )}
          </div>
        </form>
      </section>

      {/* ================= ACCOUNT STATUS + NOTIFICATIONS ================= */}
      <section className="bg-neutral-950 border border-neutral-800 rounded-2xl p-8 space-y-6">
        <h2 className="text-yellow-400 font-semibold text-lg">
          Account Status
        </h2>

        {user.isBlocked && (
          <div className="bg-red-600/10 border border-red-600/30 p-4 rounded-lg">
            <p className="text-red-400 font-medium">Account Blocked</p>
            {user.blockReason && (
              <p className="text-sm text-neutral-400 mt-1">
                Reason: {user.blockReason}
              </p>
            )}
          </div>
        )}

        <div>
          <p className="text-sm text-neutral-400 mb-4">
            Recent Notifications
          </p>

          {user.notifications && user.notifications.length > 0 ? (
            <>
              <div className="space-y-3">
                {user.notifications
                  .slice(0, visibleCount)
                  .map((n) => (
                    <div
                      key={n._id}
                      className={`p-4 rounded-lg border ${getNotificationStyle(
                        n.type
                      )}`}
                    >
                      <div className="flex justify-between items-center">
                        <p className="font-medium">{n.title}</p>
                        {!n.isRead && (
                          <span className="text-xs px-2 py-1 bg-white/10 rounded-full">
                            New
                          </span>
                        )}
                      </div>

                      <p className="text-sm mt-1 opacity-80">
                        {n.message}
                      </p>

                      <p className="text-xs mt-2 opacity-60">
                        {formatDate(n.createdAt)}
                      </p>
                    </div>
                  ))}
              </div>

              {visibleCount < user.notifications.length && (
                <div className="mt-6 text-center">
                  <button
                    onClick={() => setVisibleCount((prev) => prev + 5)}
                    className="px-6 py-2 text-sm rounded-lg border border-neutral-700 hover:border-neutral-500 transition"
                  >
                    Load More
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="text-neutral-500 text-sm">
              No notifications available.
            </p>
          )}
        </div>
      </section>

      {/* ================= LOGOUT ================= */}
      <section className="bg-red-950/70 border border-neutral-700 rounded-2xl p-8">
        <h2 className="text-red-400 font-semibold text-lg mb-4">
          Danger Zone
        </h2>

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-medium"
        >
          Logout
        </button>
      </section>
    </div>
  );
}

/* ================= REUSABLE UI ================= */

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="p-6">
      <p className="text-neutral-400 text-sm mb-2">{label}</p>
      <p className="text-lg font-medium text-white/60">{value}</p>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm text-neutral-400 mb-2">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-black border border-neutral-800 px-4 py-3 rounded-lg"
      />
    </div>
  );
}

function Textarea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm text-neutral-400 mb-2">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        maxLength={300}
        className="w-full bg-black border border-neutral-800 px-4 py-3 rounded-lg"
      />
    </div>
  );
}