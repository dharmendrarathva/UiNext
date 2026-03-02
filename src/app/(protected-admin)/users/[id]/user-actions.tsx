"use client";

import { useState } from "react";

interface Props {
  userId: string;
  isBlocked: boolean;
}

export default function AdminUserActions({ userId, isBlocked }: Props) {
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");

  const blockUser = async () => {
    setLoading(true);

    await fetch(`/api/admin/users/${userId}/block`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason }),
    });

    window.location.reload();
  };

  const sendNotification = async () => {
    setLoading(true);

    await fetch(`/api/admin/users/${userId}/notify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        message,
        type: "WARNING",
      }),
    });

    setTitle("");
    setMessage("");
    setLoading(false);
    alert("Notification sent");
  };

  return (
    <div className="bg-neutral-900 p-6 rounded-2xl space-y-6">

      {/* BLOCK SECTION */}
      <div className="space-y-3">
        <h3 className="text-xl font-semibold">Block User</h3>

        {!isBlocked && (
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
              Block User
            </button>
          </>
        )}

        {isBlocked && (
          <p className="text-red-400">This user is already blocked.</p>
        )}
      </div>

      {/* NOTIFICATION SECTION */}
      <div className="space-y-3">
        <h3 className="text-xl font-semibold">Send Notification</h3>

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

        <button
          onClick={sendNotification}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm"
        >
          Send Notification
        </button>
      </div>

    </div>
  );
}