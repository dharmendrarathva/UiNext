import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { ProductLike } from "@/models/ProductLike";
import { ProductFavorite } from "@/models/ProductFavorite";
import { Product } from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

//////////////////////////////////////////////////////
// TOGGLE LIKE
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
    // CHECK EXISTING LIKE
    ////////////////////////////////////////////////////

    const existing = await ProductLike.findOne({
      user: session.user.id,
      product: productId
    });

    ////////////////////////////////////////////////////
    // UNLIKE
    ////////////////////////////////////////////////////

    if (existing) {

      await ProductLike.deleteOne({ _id: existing._id });

      product.likesCount = Math.max(
        (product.likesCount || 0) - 1,
        0
      );

      await product.save();

      return NextResponse.json({
        liked: false,
        likesCount: product.likesCount
      });

    }

    ////////////////////////////////////////////////////
    // LIKE
    ////////////////////////////////////////////////////

    await ProductLike.create({
      user: session.user.id,
      product: productId
    });

    product.likesCount = (product.likesCount || 0) + 1;

    await product.save();

    return NextResponse.json({
      liked: true,
      likesCount: product.likesCount
    });

  } catch (error) {

    console.error("LIKE ERROR:", error);

    return NextResponse.json(
      { error: "Failed to toggle like" },
      { status: 500 }
    );

  }

}

//////////////////////////////////////////////////////
// GET LIKED PRODUCTS
//////////////////////////////////////////////////////

export async function GET() {

  await connectDB();

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) return NextResponse.json([]);

  ////////////////////////////////////////////////////
  // LIKES
  ////////////////////////////////////////////////////

  const likes = await ProductLike.find({
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
  // USER FAVORITES
  ////////////////////////////////////////////////////

  const favorites = await ProductFavorite
    .find({ user: userId })
    .select("product")
    .lean();

  const savedIds = new Set(
    favorites.map((f: any) => f.product.toString())
  );

  ////////////////////////////////////////////////////
  // ATTACH FLAGS
  ////////////////////////////////////////////////////

  const result = likes
    .filter((l: any) => l.product)
    .map((l: any) => {

      const id = l.product._id.toString();

      return {

        ...l,

        product: {
          ...l.product,
          _id: id,

          liked: true,
          saved: savedIds.has(id)
        }

      };

    });

  return NextResponse.json(result);

}