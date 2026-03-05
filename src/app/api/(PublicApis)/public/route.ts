import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { Follow } from "@/models/Follow";

export async function GET() {
  await connectDB();

  const session = await getServerSession(authOptions);
  const currentUserId = session?.user?.id;

  const users = await User.find({
    isDeleted: false,
    isBlocked: false,
  })
.select("username name image")
    .lean();

  let followingIds: string[] = [];

  if (currentUserId) {
    const follows = await Follow.find({
      follower: currentUserId,
    }).select("following");

    followingIds = follows.map((f) => f.following.toString());
  }

  const formatted = users
    .filter((u: any) => u._id.toString() !== currentUserId)
    .map((u: any) => ({
      _id: u._id.toString(),
      username: u.username,
      image: u.image ?? null,
      isFollowing: followingIds.includes(u._id.toString()),
      name:u.name
    }));

  return NextResponse.json(formatted);
}



