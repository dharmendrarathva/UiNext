"use client";

import { useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";


interface PolicyToUploadProps {
  open: boolean;
  onAccepted: () => void;
  onClose: () => void;
}

export default function PolicyToUpload({
  open,
  onAccepted,
  onClose,
}: PolicyToUploadProps) {

  const [agreePolicy, setAgreePolicy] = useState(false);
  const [agreeOriginal, setAgreeOriginal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [countdown, setCountdown] = useState(15);

  /* 10s countdown when modal opens */

  useEffect(() => {
    if (!open) return;

    setCountdown(15);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [open]);

  const canInteract = countdown === 0;
  const canSubmit = agreePolicy && agreeOriginal && canInteract;

  async function acceptPolicy() {
    if (!canSubmit) return;

    try {
      setLoading(true);

      const res = await fetch("/api/users/policy", {
        method: "PATCH",
      });

      if (!res.ok) {
        console.error("Policy update failed");
        return;
      }

      onAccepted();

    } catch (error) {
      console.error("Policy error:", error);
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">

      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl p-8">

        {/* CLOSE BUTTON */}

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white text-xl"
        >
          <IoCloseOutline size={26} />
        </button>

        {/* TITLE */}

        <h2 className="text-2xl font-semibold text-white mb-2">
          Upload Policy
        </h2>

        <p className="text-sm text-neutral-400 mb-6">
          Please read these guidelines carefully before submitting products.
        </p>

        {/* COUNTDOWN MESSAGE */}

      

        {/* POLICY TEXT */}

        <div className="space-y-4 text-sm text-neutral-300 leading-relaxed">

          <p>• Maximum <span className="text-white font-medium">30 products per month</span>.</p>
          <p>• All products go through <span className="text-white font-medium">manual review</span>.</p>
          <p>• Review takes <span className="text-white font-medium">3–7 days</span>.</p>
          <p>• Products must be <span className="text-white font-medium">original work</span>.</p>
          <p>• Spam or copied content may cause <span className="text-red-400 font-medium">account block</span>.</p>
          <p>• Approved products <span className="text-white font-medium">cannot be edited</span>.</p>
          <p>• Rejected products can be <span className="text-white font-medium">fixed and resubmitted</span>.</p>

        </div>

        {/* CHECKBOXES */}

        <div className="mt-6 space-y-3 text-sm">

          <label className={`flex items-center gap-3 ${!canInteract && "opacity-50 cursor-not-allowed"}`}>
            <input
              type="checkbox"
              disabled={!canInteract}
              checked={agreePolicy}
              onChange={(e) => setAgreePolicy(e.target.checked)}
              className="w-4 h-4"
            />
            <span>I have read and understand the creator policy</span>
          </label>

          <label className={`flex items-center gap-3 ${!canInteract && "opacity-50 cursor-not-allowed"}`}>
            <input
              type="checkbox"
              disabled={!canInteract}
              checked={agreeOriginal}
              onChange={(e) => setAgreeOriginal(e.target.checked)}
              className="w-4 h-4"
            />
            <span>I confirm all uploaded products are my original work</span>
          </label>

        </div>
          {countdown > 0 && (
          <div className="mb-6 mt-8 text-neutral-100 text-xl">
            Please read the policy carefully ({countdown}s)
          </div>
        )}

        {/* ACTION BUTTON */}

        <div className="flex justify-end mt-8">

          <button
            onClick={acceptPolicy}
            disabled={!canSubmit || loading}
            className={`px-6 py-2 rounded-lg font-medium transition
              ${
                canSubmit
                  ? "bg-yellow-500 text-black hover:bg-yellow-400"
                  : "bg-neutral-700 text-neutral-400 cursor-not-allowed"
              }`}
          >
            {loading ? "Processing..." : "Agree & Continue"}
          </button>

        </div>

      </div>
    </div>
  );
}