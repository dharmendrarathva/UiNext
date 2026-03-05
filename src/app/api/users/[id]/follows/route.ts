import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Follow } from "@/models/Follow";
import mongoose from "mongoose";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
  }

  await connectDB();

  if (type === "followers") {
    const followers = await Follow.find({ following: id })
      .populate("follower", "name username image")
      .lean();

    return NextResponse.json(
      followers.map((f: any) => f.follower)
    );
  }

  if (type === "following") {
    const following = await Follow.find({ follower: id })
      .populate("following", "name username image")
      .lean();

    return NextResponse.json(
      following.map((f: any) => f.following)
    );
  }

  return NextResponse.json({ error: "Invalid type" }, { status: 400 });
}