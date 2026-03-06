import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { ProductFavorite } from "@/models/ProductFavorite";
import { Product } from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ProductLike } from "@/models/ProductLike";

//////////////////////////////////////////////////////
// GET FAVORITES
//////////////////////////////////////////////////////



export async function GET() {

  await connectDB();

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) return NextResponse.json([]);

  ////////////////////////////////////////////////////
  // FAVORITES
  ////////////////////////////////////////////////////

  const favorites = await ProductFavorite.find({
    user: userId,
  })
    .populate({
      path: "product",
      select:
        "title slug price thumbnail createdBy likesCount favoritesCount viewsCount",
      populate: {
        path: "createdBy",
        select: "username",
      },
    })
    .sort({ createdAt: -1 })
    .lean();

  ////////////////////////////////////////////////////
  // USER LIKES
  ////////////////////////////////////////////////////

  const likes = await ProductLike.find({
    user: userId,
  }).select("product");

  const likedIds = new Set(
    likes.map((l: any) => l.product.toString())
  );

  ////////////////////////////////////////////////////
  // ATTACH FLAGS
  ////////////////////////////////////////////////////

  const result = favorites.map((f: any) => ({

    ...f,

    product: {
      ...f.product,
      liked: likedIds.has(f.product._id.toString()),
      saved: true, // already favorite
    },

  }));

  return NextResponse.json(result);

}

//////////////////////////////////////////////////////
// TOGGLE FAVORITE
//////////////////////////////////////////////////////

export async function POST(req: Request) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID required" },
        { status: 400 }
      );
    }

    //////////////////////////////////////////////////
    // CHECK IF ALREADY FAVORITED
    //////////////////////////////////////////////////

    const existing = await ProductFavorite.findOne({
      user: session.user.id,
      product: productId,
    });

    if (existing) {
      await ProductFavorite.deleteOne({ _id: existing._id });

      await Product.updateOne(
        { _id: productId },
        { $inc: { favoritesCount: -1 } }
      );

      return NextResponse.json({ favorited: false });
    }

    //////////////////////////////////////////////////
    // CREATE FAVORITE
    //////////////////////////////////////////////////

    await ProductFavorite.create({
      user: session.user.id,
      product: productId,
    });

    await Product.updateOne(
      { _id: productId },
      { $inc: { favoritesCount: 1 } }
    );

    return NextResponse.json({ favorited: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to toggle favorite" },
      { status: 500 }
    );
  }
}