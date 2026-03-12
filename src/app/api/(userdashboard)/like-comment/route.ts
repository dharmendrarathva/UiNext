import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { ProductComment } from "@/models/ProductComment";
import { CommentLike } from "@/models/CommentLike";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

//////////////////////////////////////////////////////
// TOGGLE COMMENT LIKE
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

    const { commentId } = await req.json();

    if (!commentId) {
      return NextResponse.json(
        { error: "commentId required" },
        { status: 400 }
      );
    }

    //////////////////////////////////////////////////////
    // CHECK EXISTING LIKE
    //////////////////////////////////////////////////////

    const existing = await CommentLike.findOne({
      user: session.user.id,
      comment: commentId,
    });

    //////////////////////////////////////////////////////
    // UNLIKE
    //////////////////////////////////////////////////////

    if (existing) {

      await existing.deleteOne();

      await ProductComment.findByIdAndUpdate(
        commentId,
        { $inc: { likesCount: -1 } }
      );

      return NextResponse.json({
        liked: false,
      });

    }

    //////////////////////////////////////////////////////
    // LIKE
    //////////////////////////////////////////////////////

    await CommentLike.create({
      user: session.user.id,
      comment: commentId,
    });

    await ProductComment.findByIdAndUpdate(
      commentId,
      { $inc: { likesCount: 1 } }
    );

    return NextResponse.json({
      liked: true,
    });

  } catch (error) {

    console.error("Comment like error:", error);

    return NextResponse.json(
      { error: "Failed to toggle like" },
      { status: 500 }
    );

  }

}