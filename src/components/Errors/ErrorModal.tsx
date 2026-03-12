"use client";

interface Props {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

export default function ErrorModal({
  isOpen,
  message,
  onClose,
}: Props) {

  if (!isOpen) return null;

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">

      <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-6 w-[320px] text-center">

        <h3 className="text-lg font-semibold mb-3 text-red-400">
          Error
        </h3>

        <p className="text-neutral-300 mb-6">
          {message}
        </p>

        <button
          onClick={onClose}
          className="bg-yellow-500 text-black px-6 py-2 rounded-lg font-medium hover:bg-yellow-400 transition"
        >
          OK
        </button>

      </div>

    </div>





  );
}