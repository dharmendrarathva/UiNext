import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { ProductFavorite } from "@/models/ProductFavorite";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  await connectDB();

  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json([], { status: 200 });
  }

  const favorites = await ProductFavorite.find({
    user: session.user.id,
  })
    .populate({
      path: "product",
      populate: {
        path: "createdBy",
        select: "username",
      },
    })
    .sort({ createdAt: -1 });

  return NextResponse.json(favorites);
}