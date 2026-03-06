




import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import { ProductLike } from "@/models/ProductLike";
import { ProductFavorite } from "@/models/ProductFavorite";
import { NextResponse } from "next/server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // adjust path if needed

export async function GET() {

  try {

    await connectDB();

    ////////////////////////////////////////////////////
    // SESSION
    ////////////////////////////////////////////////////

    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    ////////////////////////////////////////////////////
    // GET PRODUCTS
    ////////////////////////////////////////////////////

    const products = await Product.find({
      status: "APPROVED",
      isDeleted: false,
    })
      .populate("createdBy", "username")
      .sort({ createdAt: -1 })
      .lean();

    ////////////////////////////////////////////////////
    // IF USER NOT LOGGED IN
    ////////////////////////////////////////////////////

    if (!userId) {

      const result = products.map((p: any) => ({
        ...p,
        liked: false,
        saved: false,
      }));

      return NextResponse.json(result);

    }

    ////////////////////////////////////////////////////
    // USER LIKES
    ////////////////////////////////////////////////////

    const likes = await ProductLike.find({
      user: userId,
    }).select("product");

    ////////////////////////////////////////////////////
    // USER FAVORITES
    ////////////////////////////////////////////////////

    const favorites = await ProductFavorite.find({
      user: userId,
    }).select("product");

    const likedIds = new Set(
      likes.map((l: any) => l.product.toString())
    );

    const savedIds = new Set(
      favorites.map((f: any) => f.product.toString())
    );

    ////////////////////////////////////////////////////
    // ATTACH FLAGS
    ////////////////////////////////////////////////////

    const result = products.map((p: any) => ({
      ...p,
      liked: likedIds.has(p._id.toString()),
      saved: savedIds.has(p._id.toString()),
    }));

    return NextResponse.json(result);

  } catch (error) {

    console.error("PRODUCT API ERROR:", error);

    return NextResponse.json(
      { error: "Failed to load products" },
      { status: 500 }
    );

  }
}
