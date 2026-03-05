import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";
import { User } from "@/models/User";
import { Product } from "@/models/Product";
import { Follow } from "@/models/Follow";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await connectDB();

  const session = await getServerSession(authOptions);
  const currentUserId = session?.user?.id;

  const user = await User.findById(id).select(
    "name username image bio website followersCount followingCount"
  );

  if (!user) {
    return NextResponse.json({}, { status: 404 });
  }

  let isFollowing = false;

  if (currentUserId) {
    const follow = await Follow.findOne({
      follower: currentUserId,
      following: id,
    });

    isFollowing = !!follow;
  }

  const products = await Product.find({
    createdBy: id,
    status: "APPROVED",
    isDeleted: false,
  })
    .select("title slug price thumbnail")
    .sort({ createdAt: -1 });

  return NextResponse.json({
    user: {
      ...user.toObject(),
      isFollowing,
    },
    products,
  });
}