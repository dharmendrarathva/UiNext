"use client";

import { useState } from "react";
import { IoCloseOutline } from "react-icons/io5";

interface ApplyFormProps {
  role: string;
  onClose: () => void;
}

export default function ApplyForm({ role, onClose }: ApplyFormProps) {
  const [loading, setLoading] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-neutral-900 border border-white/10 rounded-2xl p-8 shadow-[0_40px_120px_rgba(0,0,0,0.8)]">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white transition"
        >
          <IoCloseOutline size={26} />
        </button>

        <h2 className="text-2xl font-semibold mb-2">
          Apply for {role}
        </h2>

        <p className="text-neutral-400 text-sm mb-8">
          Tell us about yourself and share your GitHub profile.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setLoading(true);
            setTimeout(() => {
              setLoading(false);
              onClose();
            }, 1500);
          }}
          className="space-y-6"
        >

          <div>
            <label className="block text-sm text-neutral-400 mb-2">
              Full Name
            </label>
            <input
              required
              type="text"
              className="w-full bg-neutral-800 border border-white/10 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-neutral-400 mb-2">
              Email
            </label>
            <input
              required
              type="email"
              className="w-full bg-neutral-800 border border-white/10 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-neutral-400 mb-2">
              GitHub Profile
            </label>
            <input
              required
              type="url"
              placeholder="https://github.com/yourusername"
              className="w-full bg-neutral-800 border border-white/10 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-neutral-400 mb-2">
              Why should we hire you?
            </label>
            <textarea
              required
              rows={4}
              className="w-full bg-neutral-800 border border-white/10 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-amber-500 text-black font-medium py-3 rounded-lg hover:bg-amber-400 transition"
          >
            {loading ? "Submitting..." : "Submit Application"}
          </button>

        </form>
      </div>
    </div>
  );
}