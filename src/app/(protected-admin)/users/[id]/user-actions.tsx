


"use client";

import { useState } from "react";

type NotificationType = "WARNING" | "INFO";

interface Props {
  userId: string;
  isBlocked: boolean;
}

export default function AdminUserActions({ userId, isBlocked }: Props) {
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<NotificationType>("INFO");

  /* ================= BLOCK USER ================= */

  const blockUser = async () => {
    if (!reason.trim()) {
      alert("Block reason required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/admin/users/${userId}/block`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data || "Failed to block user");
        setLoading(false);
        return;
      }

      window.location.reload();
    } catch {
      alert("Something went wrong");
      setLoading(false);
    }
  };

  /* ================= UNBLOCK USER ================= */

  const unblockUser = async () => {
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/users/${userId}/unblock`, {
        method: "PATCH",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data || "Failed to unblock user");
        setLoading(false);
        return;
      }

      window.location.reload();
    } catch {
      alert("Something went wrong");
      setLoading(false);
    }
  };

  /* ================= SEND NOTIFICATION ================= */

  const sendNotification = async () => {
    if (!title.trim() || !message.trim()) {
      alert("Title and message required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/admin/users/${userId}/notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          message,
          type,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data || "Failed to send notification");
        setLoading(false);
        return;
      }

      setTitle("");
      setMessage("");
      setType("INFO");

      alert("Notification sent");
    } catch {
      alert("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="bg-neutral-900 p-6 rounded-2xl space-y-8">

      {/* ================= BLOCK SECTION ================= */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Moderation</h3>

        {!isBlocked ? (
          <>
            <textarea
              placeholder="Reason for blocking"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-neutral-800 p-3 rounded-lg text-sm"
            />

            <button
              onClick={blockUser}
              disabled={loading}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm"
            >
              {loading ? "Processing..." : "Block User"}
            </button>
          </>
        ) : (
          <>
            <p className="text-red-400">
              User is currently blocked.
            </p>

            <button
              onClick={unblockUser}
              disabled={loading}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm"
            >
              {loading ? "Processing..." : "Unblock User"}
            </button>
          </>
        )}
      </div>

      {/* ================= NOTIFICATION SECTION ================= */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">
          Send Notification
        </h3>

        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-neutral-800 p-3 rounded-lg text-sm"
        />

        <textarea
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full bg-neutral-800 p-3 rounded-lg text-sm"
        />

        <select
          value={type}
          onChange={(e) =>
            setType(e.target.value as NotificationType)
          }
          className="w-full bg-neutral-800 p-3 rounded-lg text-sm"
        >
          <option value="INFO">INFO</option>
          <option value="WARNING">WARNING</option>
        </select>

        <button
          onClick={sendNotification}
          disabled={loading}
          className={`px-6 py-2 rounded-lg text-sm ${
            type === "WARNING"
              ? "bg-yellow-600 hover:bg-yellow-700"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Sending..." : "Send Notification"}
        </button>
      </div>
    </div>
  );
}