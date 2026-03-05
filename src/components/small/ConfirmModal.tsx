"use client";

interface ConfirmModalProps {
  open: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  open,
  title = "Confirm Action",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm">

      <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl">

        {/* Title */}
        <h3 className="text-lg font-semibold text-white">
          {title}
        </h3>

        {/* Message */}
        <p className="text-sm text-neutral-400 mt-2 leading-relaxed">
          {message}
        </p>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">

          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white transition"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm rounded-lg bg-red-500 hover:bg-red-400 text-white transition"
          >
            {confirmText}
          </button>

        </div>

      </div>
    </div>
  );
}