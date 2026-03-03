import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const products = await Product.find({
    owner: session.user.id,
    isDeleted: false,
  })
    .populate("category", "name")
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json(products);
}