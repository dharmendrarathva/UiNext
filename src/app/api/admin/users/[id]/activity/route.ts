import { connectDB } from "@/lib/db";
import { UserActivity } from "@/models/UserActivity";
import { NextRequest } from "next/server";
import mongoose from "mongoose";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();

  // Validate Mongo ObjectId
  if (!mongoose.Types.ObjectId.isValid(params.id)) {
    return new Response("Invalid user id", { status: 400 });
  }

  const activity = await UserActivity.find({
    userId: params.id,
  })
    .sort({ createdAt: -1 })
    .lean();

  return Response.json(activity);
}