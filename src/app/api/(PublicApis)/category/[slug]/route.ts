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

  await connectDB();

  const { slug } = await params;

  //////////////////////////////////////////////////
  // SESSION
  //////////////////////////////////////////////////

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  //////////////////////////////////////////////////
  // CATEGORY
  //////////////////////////////////////////////////

  const category = await Category.findOne({ slug });

  if (!category) {

    return NextResponse.json(
      { error: "Category not found" },
      { status: 404 }
    );

  }

  //////////////////////////////////////////////////
  // PRODUCTS
  //////////////////////////////////////////////////

  const products = await Product.find({
    category: category._id,
    status: "APPROVED",
    isDeleted: false,
  })
    .populate("createdBy", "username")
    .sort({ createdAt: -1 })
    .lean();

  //////////////////////////////////////////////////
  // USER NOT LOGGED IN
  //////////////////////////////////////////////////

  if (!userId) {

    const result = products.map((p: any) => ({
      ...p,
      liked: false,
      saved: false,
    }));

    return NextResponse.json({
      category,
      products: result,
    });

  }

  //////////////////////////////////////////////////
  // USER LIKES
  //////////////////////////////////////////////////

  const likes = await ProductLike.find({
    user: userId,
  }).select("product");

  //////////////////////////////////////////////////
  // USER FAVORITES
  //////////////////////////////////////////////////

  const favorites = await ProductFavorite.find({
    user: userId,
  }).select("product");

  const likedIds = new Set(
    likes.map((l: any) => l.product.toString())
  );

  const savedIds = new Set(
    favorites.map((f: any) => f.product.toString())
  );

  //////////////////////////////////////////////////
  // ATTACH FLAGS
  //////////////////////////////////////////////////

  const result = products.map((p: any) => ({
    ...p,
    liked: likedIds.has(p._id.toString()),
    saved: savedIds.has(p._id.toString()),
  }));

  return NextResponse.json({
    category,
    products: result,
  });

}