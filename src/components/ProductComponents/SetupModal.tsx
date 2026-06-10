"use client";

import { Category } from "@/types/Category";

interface Props {
  open: boolean;
  categories: Category[];
  category: string;
  implementation: string;
  onChange: (e: any) => void;
  onContinue: () => void;
  onClose: () => void;
}

export default function SetupModal({
  open,
  categories,
  category,
  implementation,
  onChange,
  onContinue,
  onClose
}: Props) {

  if (!open) return null;

  const isValid = category && implementation;

  return (
    <div className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center">

      <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-8 w-full max-w-md">

        <h2 className="text-xl font-semibold text-white mb-6 text-center">
          Setup Your Component
        </h2>

        <div className="flex flex-col gap-4">

          {/* CATEGORY */}
          <select
            name="category"
            value={category}
            onChange={onChange}
            className="bg-neutral-800 px-4 py-3 rounded-lg"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* TECH STACK */}
          <select
            name="implementation"
            value={implementation}
            onChange={onChange}
            className="bg-neutral-800 px-4 py-3 rounded-lg"
          >
            <option value="">Select Tech Stack</option>
            <option value="HTML">HTML + CSS + JS</option>
            <option value="TAILWIND">Tailwind</option>
          </select>

          {/* ACTIONS */}
          <div className="flex gap-3 mt-4">

            <button
              onClick={onClose}
              className="flex-1 bg-neutral-800 px-4 py-2 rounded-lg"
            >
              Cancel
            </button>

            <button
              disabled={!isValid}
              onClick={onContinue}
              className={`flex-1 rounded-lg py-2 font-semibold transition ${
                isValid
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-neutral-700 cursor-not-allowed"
              }`}
            >
              Continue
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}