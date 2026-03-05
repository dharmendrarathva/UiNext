"use client";

interface PolicyToUploadProps {
  open: boolean;
  onClose: () => void;
}

export default function PolicyToUpload({ open, onClose }: PolicyToUploadProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">

      <div className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl p-8">

        {/* Title */}

        <h2 className="text-2xl font-semibold text-white mb-2">
          Upload Policy
        </h2>

        <p className="text-sm text-neutral-400 mb-6">
          Please read these guidelines carefully before submitting products to
          UiSnap.
        </p>

        {/* Policy List */}

        <div className="space-y-4 text-sm text-neutral-300 leading-relaxed">

          <p>
            • You can create and submit a maximum of{" "}
            <span className="text-white font-medium">30 products per month</span>.
          </p>

          <p>
            • Every submitted product goes through a{" "}
            <span className="text-white font-medium">manual review process</span>{" "}
            by the UiSnap team.
          </p>

          <p>
            • The review process typically takes{" "}
            <span className="text-white font-medium">3–7 days</span>.
          </p>

          <p>
            • Products must be{" "}
            <span className="text-white font-medium">
              original work created by you
            </span>. Do not upload copied assets or content taken from other
            platforms.
          </p>

          <p>
            • If our team detects{" "}
            <span className="text-white font-medium">spam or copied content</span>,
            your account may be{" "}
            <span className="text-red-400 font-medium">permanently blocked</span>{" "}
            and you may lose access to UiSnap.
          </p>

          <p>
            • Once a product is{" "}
            <span className="text-white font-medium">approved</span>, it{" "}
            <span className="text-white font-medium">cannot be edited</span>.
          </p>

          <p>
            • If a product is{" "}
            <span className="text-yellow-400 font-medium">rejected</span>, you can
            review the rejection reason, improve the product, and{" "}
            <span className="text-white font-medium">resubmit it again</span>.
          </p>

          <p>
            • After approval, products{" "}
            <span className="text-white font-medium">cannot be edited</span>, but
            you are still able to{" "}
            <span className="text-white font-medium">delete them</span>.
          </p>

        </div>

        {/* Buttons */}

        <div className="flex justify-end mt-8">

          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-yellow-500 text-black font-medium hover:bg-yellow-400 transition"
          >
            I Understand
          </button>

        </div>

      </div>
    </div>
  );
}