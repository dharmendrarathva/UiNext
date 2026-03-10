import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { ProductComment } from "@/models/ProductComment";
import { Product } from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

//////////////////////////////////////////////////////
// GET COMMENTS
//////////////////////////////////////////////////////

export async function GET(req: NextRequest) {

  try {

    await connectDB();

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json([], { status: 200 });
    }

    const comments = await ProductComment
      .find({
        product: productId,
        isDeleted: false
      })
      .populate("user", "username image")
      .sort({ createdAt: -1 });

    return NextResponse.json(comments);

  } catch (err) {

    console.error(err);

    return NextResponse.json(
      { error: "Failed to load comments" },
      { status: 500 }
    );

  }

}

//////////////////////////////////////////////////////
// CREATE COMMENT
//////////////////////////////////////////////////////

export async function POST(req: NextRequest) {

  try {

    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { productId, content } = await req.json();

    if (!productId || !content) {
      return NextResponse.json(
        { error: "Invalid data" },
        { status: 400 }
      );
    }

    const comment = await ProductComment.create({
      product: productId,
      user: session.user.id,
      content
    });

    await Product.findByIdAndUpdate(
      productId,
      { $inc: { commentsCount: 1 } }
    );

    const populated = await comment.populate(
      "user",
      "username image"
    );

    return NextResponse.json(populated);

  } catch (err) {

    console.error(err);

    return NextResponse.json(
      { error: "Failed to add comment" },
      { status: 500 }
    );

  }

}