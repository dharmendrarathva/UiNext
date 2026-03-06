import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";
import { ProductLike } from "@/models/ProductLike";
import { ProductFavorite } from "@/models/ProductFavorite";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {

  const { slug } = await params;

  await connectDB();

  /////////////////////////////////////////////////////////
  // SESSION
  /////////////////////////////////////////////////////////

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  /////////////////////////////////////////////////////////
  // CATEGORY
  /////////////////////////////////////////////////////////

  const category = await Category.findOne({ slug }).lean();

  if (!category) {
    return NextResponse.json(
      { error: "Category not found" },
      { status: 404 }
    );
  }

  /////////////////////////////////////////////////////////
  // PRODUCTS
  /////////////////////////////////////////////////////////

  const products = await Product.find({
    category: category._id,
    status: "APPROVED",
    isDeleted: false,
  })
    .populate("createdBy", "username")
    .sort({ createdAt: -1 })
    .lean();

  /////////////////////////////////////////////////////////
  // USER LIKES / SAVES
  /////////////////////////////////////////////////////////

  let likedIds = new Set<string>();
  let savedIds = new Set<string>();

  if (userId) {

    const likes = await ProductLike
      .find({ user: userId })
      .select("product")
      .lean();

    likedIds = new Set(
      likes.map((l: any) => l.product.toString())
    );

    const favorites = await ProductFavorite
      .find({ user: userId })
      .select("product")
      .lean();

    savedIds = new Set(
      favorites.map((f: any) => f.product.toString())
    );

  }

  /////////////////////////////////////////////////////////
  // SERIALIZE PRODUCTS
  /////////////////////////////////////////////////////////

  const result = products.map((p: any) => {

    const id = p._id.toString();

    return {

      ...p,

      _id: id,

      category: p.category?.toString(),

      createdBy: p.createdBy
        ? {
            _id: p.createdBy._id.toString(),
            username: p.createdBy.username,
          }
        : null,

      liked: likedIds.has(id),

      saved: savedIds.has(id),

    };

  });

  /////////////////////////////////////////////////////////
  // RESPONSE
  /////////////////////////////////////////////////////////

  return NextResponse.json({
    category: {
      ...category,
      _id: category._id.toString(),
    },
    products: result,
  });

}