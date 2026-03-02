import { connectDB } from "@/lib/db";
import { Notification } from "@/models/Notification";
import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // ✅ unwrap

  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { title, message, type } = await req.json();

  if (!title || !message) {
    return new Response("Title and message required", { status: 400 });
  }

  await connectDB();

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return new Response("Invalid user id", { status: 400 });
  }

  await Notification.create({
    to: id,
    fromAdmin: session.user.id,
    title,
    message,
    type: type || "INFO",
  });

  return Response.json({ success: true });
}