import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Follow } from "@/models/Follow";
import { User } from "@/models/User";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const currentUser = await User.findById(session.user.id);
  if (!currentUser || currentUser.isBlocked) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  const { targetUserId } = await req.json();

  if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
    return NextResponse.json({ error: "Invalid user" }, { status: 400 });
  }

  if (targetUserId === session.user.id) {
    return NextResponse.json(
      { error: "Cannot follow yourself" },
      { status: 400 }
    );
  }

  const existing = await Follow.findOne({
    follower: session.user.id,
    following: targetUserId,
  });

  // UNFOLLOW
  if (existing) {
    await Follow.deleteOne({ _id: existing._id });

    await User.findByIdAndUpdate(session.user.id, {
      $inc: { followingCount: -1 },
    });

    await User.findByIdAndUpdate(targetUserId, {
      $inc: { followersCount: -1 },
    });

    return NextResponse.json({ message: "Unfollowed" });
  }

  // FOLLOW
  await Follow.create({
    follower: session.user.id,
    following: targetUserId,
  });

  await User.findByIdAndUpdate(session.user.id, {
    $inc: { followingCount: 1 },
  });

  await User.findByIdAndUpdate(targetUserId, {
    $inc: { followersCount: 1 },
  });

  return NextResponse.json({ message: "Followed" });
}