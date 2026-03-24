import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import { User } from "@/models/User";
import { ProductLike } from "@/models/ProductLike";
import { ProductFavorite } from "@/models/ProductFavorite";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import "@/models/Category";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ username: string; slug: string }> }
) {

  const { username, slug } = await params;

  try {

    await connectDB();

    ////////////////////////////////////////////////////
    // SESSION
    ////////////////////////////////////////////////////

    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    ////////////////////////////////////////////////////
    // USER
    ////////////////////////////////////////////////////

    const user = await User.findOne({ username });

    if (!user)
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );

    ////////////////////////////////////////////////////
    // PRODUCT
    ////////////////////////////////////////////////////

    const product = await Product.findOne({
      slug,
      createdBy: user._id,
      status: "APPROVED",
      isDeleted: false,
    })
      .select("-price -description -images") // keep removed
      .populate("createdBy", "username image name")
      .populate("category", "name slug icon")
      .lean();

    if (!product)
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );

    ////////////////////////////////////////////////////
    // DEFAULT FLAGS
    ////////////////////////////////////////////////////

    let liked = false;
    let saved = false;

    ////////////////////////////////////////////////////
    // USER INTERACTIONS
    ////////////////////////////////////////////////////

    if (userId) {

      const [like, favorite] = await Promise.all([
        ProductLike.findOne({
          user: userId,
          product: product._id,
        }),
        ProductFavorite.findOne({
          user: userId,
          product: product._id,
        }),
      ]);

      liked = !!like;
      saved = !!favorite;
    }

    ////////////////////////////////////////////////////
    // RESPONSE
    ////////////////////////////////////////////////////

    return NextResponse.json({
      ...product,
      liked,
      saved,
      codes: product.codes ?? null,
    });

  } catch (error) {

    console.error("PRODUCT PAGE API ERROR:", error);

    return NextResponse.json(
      { error: "Failed to load product" },
      { status: 500 }
    );

  }
}