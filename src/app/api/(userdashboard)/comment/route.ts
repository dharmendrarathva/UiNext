import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { ProductComment } from "@/models/ProductComment";
import { Product } from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";


import { CommentLike } from "@/models/CommentLike";

export async function GET(req: NextRequest) {

  try {

    await connectDB();

    const session = await getServerSession(authOptions);

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { error: "productId is required" },
        { status: 400 }
      );
    }

    const comments = await ProductComment
      .find({
        product: productId,
        isDeleted: false
      })
      .populate("user", "username image")
      .sort({ createdAt: -1 })
      .lean();

    //////////////////////////////////////////////////////
    // CHECK USER LIKES
    //////////////////////////////////////////////////////

    let likedMap: Record<string, boolean> = {};

    if (session) {

      const likes = await CommentLike.find({
        user: session.user.id,
        comment: { $in: comments.map(c => c._id) }
      }).lean();

      likes.forEach(l => {
        likedMap[l.comment.toString()] = true;
      });

    }

    const result = comments.map((c:any) => ({
      ...c,
      liked: likedMap[c._id.toString()] || false
    }));

    return NextResponse.json(result);

  } catch (error) {

    console.error("Comments GET error:", error);

    return NextResponse.json(
      { error: "Failed to load comments" },
      { status: 500 }
    );

  }

}

//////////////////////////////////////////////////////
// CREATE COMMENT
//////////////////////////////////////////////////////

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

    //////////////////////////////////////////////////////
    // VALIDATION
    //////////////////////////////////////////////////////

    if (!productId || !content) {
      return NextResponse.json(
        { error: "Invalid data" },
        { status: 400 }
      );
    }

    const trimmed = content.trim();

    if (trimmed.length === 0) {
      return NextResponse.json(
        { error: "Comment cannot be empty" },
        { status: 400 }
      );
    }

    if (trimmed.length > 300) {
      return NextResponse.json(
        { error: "Comment cannot exceed 250 characters" },
        { status: 400 }
      );
    }

    //////////////////////////////////////////////////////
    // SPAM PROTECTION (MAX 3 COMMENTS)
    //////////////////////////////////////////////////////

    const userCommentCount = await ProductComment.countDocuments({
      product: productId,
      user: session.user.id,
      isDeleted: false
    });

    if (userCommentCount >= 3) {
      return NextResponse.json(
        { error: "You can only post 3 comments on this product" },
        { status: 429 }
      );
    }

    //////////////////////////////////////////////////////
    // CREATE COMMENT
    //////////////////////////////////////////////////////

    const comment = await ProductComment.create({
      product: productId,
      user: session.user.id,
      content: trimmed
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

export async function DELETE(req: NextRequest) {

const session = await getServerSession(authOptions);

if(!session) {
return NextResponse.json({error:"Unauthorized"}, {status:401});
}

const { commentId } = await req.json();

const comment = await ProductComment.findById(commentId);

if(!comment) {
return NextResponse.json({error:"Not found"}, {status:404});
}

if(comment.user.toString() !== session.user.id){
return NextResponse.json({error:"Forbidden"}, {status:403});
}

comment.isDeleted = true;
await comment.save();

return NextResponse.json({success:true});

}


export async function PATCH(req: NextRequest){

const session = await getServerSession(authOptions);

if(!session) {
return NextResponse.json({error:"Unauthorized"}, {status:401});
}

const { commentId, content } = await req.json();

const comment = await ProductComment.findById(commentId);

if(!comment) {
return NextResponse.json({error:"Not found"}, {status:404});
}

if(comment.user.toString() !== session.user.id){
return NextResponse.json({error:"Forbidden"}, {status:403});
}

comment.content = content;
comment.isEdited = true;

await comment.save();

return NextResponse.json(comment);

}