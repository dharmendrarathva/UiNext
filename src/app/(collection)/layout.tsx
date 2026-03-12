import { connectDB } from "@/lib/db";
import { Category } from "@/models/Category";
import CategorySidebar from "@/components/layouts/CategorySidebar";

async function getCategories() {
  await connectDB();

  const categories = await Category.find().sort({ name: 1 }).lean();

  return categories.map((c: any) => ({
    _id: c._id.toString(),
    name: c.name,
    slug: c.slug,
  }));
}

export default async function CategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex">

      {/* Sidebar */}
      <CategorySidebar categories={categories} />

      {/* Content */}
      <div className="flex-1 p-10">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </div>

    </div>
  );
}