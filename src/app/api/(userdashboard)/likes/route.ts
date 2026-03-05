import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { ProductLike } from "@/models/ProductLike";
import { Product } from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

//////////////////////////////////////////////////////
// GET LIKED PRODUCTS
//////////////////////////////////////////////////////

export async function GET() {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json([]);
    }

    const likes = await ProductLike.find({
      user: session.user.id,
    })
      .populate({
        path: "product",
        select: "_id title slug price thumbnail createdBy",
        populate: {
          path: "createdBy",
          select: "username",
        },
      })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(likes);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to load likes" }, { status: 500 });
  }
}

//////////////////////////////////////////////////////
// TOGGLE LIKE
//////////////////////////////////////////////////////

export async function POST(req: Request) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json({ error: "Product ID required" }, { status: 400 });
    }

    const existing = await ProductLike.findOne({
      user: session.user.id,
      product: productId,
    });

    /////////////////////////////////////////////
    // REMOVE LIKE
    /////////////////////////////////////////////

    if (existing) {
      await ProductLike.deleteOne({ _id: existing._id });

      await Product.updateOne(
        { _id: productId },
        { $inc: { likesCount: -1 } }
      );

      return NextResponse.json({ liked: false });
    }

    /////////////////////////////////////////////
    // ADD LIKE
    /////////////////////////////////////////////

    await ProductLike.create({
      user: session.user.id,
      product: productId,
    });

    await Product.updateOne(
      { _id: productId },
      { $inc: { likesCount: 1 } }
    );

    return NextResponse.json({ liked: true });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to toggle like" }, { status: 500 });
  }
}