import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { Notification } from "@/models/Notification";
import { UserActivity } from "@/models/UserActivity";
import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // ✅ Next 16 fix

  const session = await getServerSession(authOptions);

  if (
    !session ||
    (session.user.role !== "ADMIN" &&
      session.user.role !== "SUPERADMIN")
  ) {
    return new Response("Unauthorized", { status: 401 });
  }

  await connectDB();

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return new Response("Invalid user id", { status: 400 });
  }

  const user = await User.findById(id);
  if (!user) {
    return new Response("User not found", { status: 404 });
  }

  user.isBlocked = false;
  user.blockReason = null;
  await user.save();

  /* ===== OPTIONAL: Create Notification ===== */
  await Notification.create({
    to: user._id,
    fromAdmin: session.user.id,
    title: "Account Restored",
    message: "Your account has been restored by the administrator.",
    type: "INFO",
  });

  /* ===== OPTIONAL: Log Activity ===== */
  await UserActivity.create({
    userId: user._id,
    type: "PROFILE_UPDATE",
  });

  return Response.json({ success: true });
}