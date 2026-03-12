import { useState } from "react";
import { Category } from "@/types/Category";

interface FormState {
  title: string;
  description: string;
  price: number;
  category: string;
}

interface Props {
  open: boolean;
  form: FormState;
  categories: Category[];
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  onClose: () => void;
  onUpdate: () => void;
}

export default function EditProduct({
  open,
  form,
  categories,
  onChange,
  onClose,
  onUpdate,
}: Props) {

  const [error, setError] = useState("");

  if (!open) return null;

  function validate() {

    if (!form.title.trim())
      return "Title required";

    if (form.title.trim().length < 3)
      return "Title must be at least 3 characters";

    if (!form.description.trim())
      return "Description required";

    if (form.description.trim().length < 10)
      return "Description must be at least 10 characters";

    if (!form.price || form.price <= 0)
      return "Price must be greater than 0";

    if (!form.category)
      return "Select a category";

    return "";
  }

  function handleUpdate() {

    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    onUpdate();
  }

  return (

    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 w-full max-w-lg">

        <h2 className="text-xl font-semibold mb-6 text-yellow-400">
          Update Product
        </h2>

        <div className="space-y-4">

          <input
            name="title"
            value={form.title}
            onChange={onChange}
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2"
          />

          <textarea
            name="description"
            value={form.description}
            onChange={onChange}
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2"
          />

          <input
            name="price"
            type="number"
            value={form.price}
            onChange={onChange}
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2"
          />

          <select
            name="category"
            value={form.category}
            onChange={onChange}
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2"
          >
            <option value="">Select Category</option>

            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          {error && (
            <p className="text-red-400 text-sm">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-4">

            <button
              onClick={handleUpdate}
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 py-2 rounded-lg"
            >
              Update
            </button>

            <button
              onClick={onClose}
              className="flex-1 bg-neutral-700 hover:bg-neutral-600 py-2 rounded-lg"
            >
              Cancel
            </button>

          </div>

        </div>

      </div>

    </div>

  );

}