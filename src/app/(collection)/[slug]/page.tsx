import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";
import { ProductLike } from "@/models/ProductLike";
import { ProductFavorite } from "@/models/ProductFavorite";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ProductCard from "@/components/ProductComponents/ProductCard";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {

  const { slug } = await params;

  await connectDB();

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  const category = await Category.findOne({ slug }).lean();

  if (!category) return notFound();

  const productsRaw = await Product.find({
    category: category._id,
    status: "APPROVED",
    isDeleted: false,
  })
    .populate("createdBy", "username")
    .sort({ createdAt: -1 })
    .lean();

  let likedIds = new Set<string>();
  let savedIds = new Set<string>();

  if (userId) {
    const likes = await ProductLike.find({ user: userId }).select("product");
    likedIds = new Set(likes.map((l: any) => l.product.toString()));

    const favorites = await ProductFavorite.find({ user: userId }).select("product");
    savedIds = new Set(favorites.map((f: any) => f.product.toString()));
  }

  const products = productsRaw.map((p: any) => {
    const plain = JSON.parse(JSON.stringify(p));

    return {
      ...plain,
      liked: likedIds.has(p._id.toString()),
      saved: savedIds.has(p._id.toString()),
    };
  });

  return (
    <div>

      <div className="mb-10">
        <h1 className="text-4xl font-bold">
          {category.name}
        </h1>

        <p className="text-neutral-400 mt-2">
          Browse models in this category
        </p>
      </div>

      {products.length > 0 ? (

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

          {products.map((p: any) => (
            <ProductCard key={p._id} product={p} />
          ))}

        </div>

      ) : (

        <p className="text-neutral-500">
          No products found in this category
        </p>

      )}

    </div>
  );
}