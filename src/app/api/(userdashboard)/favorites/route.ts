import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { ProductFavorite } from "@/models/ProductFavorite";
import { Product } from "@/models/Product";
import { ProductLike } from "@/models/ProductLike";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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
    user: userId
  })
    .populate({
      path: "product",
      select:
        "title slug codes createdBy likesCount favoritesCount viewsCount",
      populate: {
        path: "createdBy",
        select: "username"
      }
    })
    .sort({ createdAt: -1 })
    .lean();

  ////////////////////////////////////////////////////
  // USER LIKES
  ////////////////////////////////////////////////////

  const likes = await ProductLike
    .find({ user: userId })
    .select("product")
    .lean();

  const likedIds = new Set(
    likes.map((l: any) => l.product.toString())
  );

  ////////////////////////////////////////////////////
  // ATTACH FLAGS
  ////////////////////////////////////////////////////

  const result = favorites
    .filter((f: any) => f.product) // avoid deleted products
    .map((f: any) => {

      const id = f.product._id.toString();

      return {
        ...f,

        product: {
          ...f.product,
          _id: id,

          liked: likedIds.has(id),
          saved: true
        }

      };

    });

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

    ////////////////////////////////////////////////////
    // FIND PRODUCT
    ////////////////////////////////////////////////////

    const product = await Product.findById(productId);

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    ////////////////////////////////////////////////////
    // CHECK EXISTING FAVORITE
    ////////////////////////////////////////////////////

    const existing = await ProductFavorite.findOne({
      user: session.user.id,
      product: productId
    });

    ////////////////////////////////////////////////////
    // REMOVE FAVORITE
    ////////////////////////////////////////////////////

    if (existing) {

      await ProductFavorite.deleteOne({ _id: existing._id });

      product.favoritesCount = Math.max(
        (product.favoritesCount || 0) - 1,
        0
      );

      await product.save();

      return NextResponse.json({
        favorited: false,
        favoritesCount: product.favoritesCount
      });

    }

    ////////////////////////////////////////////////////
    // ADD FAVORITE
    ////////////////////////////////////////////////////

    await ProductFavorite.create({
      user: session.user.id,
      product: productId
    });

    product.favoritesCount = (product.favoritesCount || 0) + 1;

    await product.save();

    return NextResponse.json({
      favorited: true,
      favoritesCount: product.favoritesCount
    });

  } catch (error) {

    console.error("FAVORITE ERROR:", error);

    return NextResponse.json(
      { error: "Failed to toggle favorite" },
      { status: 500 }
    );

  }

}