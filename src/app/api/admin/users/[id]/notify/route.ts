import { connectDB } from "@/lib/db";
import { Notification } from "@/models/Notification";
import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // 🔐 Admin validation (IMPORTANT)
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return new Response("Unauthorized", { status: 401 });
  }

  const { title, message, type } = await req.json();

  await connectDB();

  // Validate Mongo ObjectId
  if (!mongoose.Types.ObjectId.isValid(params.id)) {
    return new Response("Invalid user id", { status: 400 });
  }

  await Notification.create({
    to: params.id,
    fromAdmin: session.user.id,
    title,
    message,
    type,
  });

  return Response.json({ success: true });
}