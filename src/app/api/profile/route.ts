import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  await connectDB();

  const { username, bio, website } = await req.json();

  const user = await User.findById(session.user.id);

  if (!user) {
    return NextResponse.json(
      { message: "User not found" },
      { status: 404 }
    );
  }

  // 🔐 Username uniqueness validation
  if (username && typeof username === "string") {
    const cleanUsername = username.trim().toLowerCase();

    const existingUsername = await User.findOne({
      username: cleanUsername,
      _id: { $ne: user._id },
    });

    if (existingUsername) {
      return NextResponse.json(
        { message: "Username already taken" },
        { status: 400 }
      );
    }

    user.username = cleanUsername;
  }

  if (typeof bio === "string") {
    user.bio = bio.trim();
  }

  if (typeof website === "string") {
    user.website = website.trim();
  }

  await user.save();

  return NextResponse.json({
    message: "Updated successfully",
  });
}