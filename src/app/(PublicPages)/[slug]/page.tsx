import { connectDB } from "@/lib/db";
import { Category } from "@/models/Category";
import { notFound } from "next/navigation";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  await connectDB();

  const category = await Category.findOne({ slug }).lean();

  if (!category) return notFound();

  return (
    <div className="p-10 text-white max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">
        {category.name}
      </h1>

      {category.description && (
        <p className="text-neutral-400">
          {category.description}
        </p>
      )}
    </div>
  );
}