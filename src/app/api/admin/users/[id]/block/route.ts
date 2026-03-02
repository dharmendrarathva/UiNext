import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { NextRequest } from "next/server";
import mongoose from "mongoose";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { reason } = await req.json();

  await connectDB();

  // Validate Mongo ObjectId
  if (!mongoose.Types.ObjectId.isValid(params.id)) {
    return new Response("Invalid user id", { status: 400 });
  }

  await User.findByIdAndUpdate(params.id, {
    isBlocked: true,
    blockReason: reason,
  });

  return Response.json({ success: true });
}