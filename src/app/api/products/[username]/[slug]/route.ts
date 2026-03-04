import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import { User } from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ username: string; slug: string }> }
) {
  const { username, slug } = await params;

  await connectDB();

  const user = await User.findOne({ username });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const product = await Product.findOne({
    slug,
    createdBy: user._id,
    status: "APPROVED",
    isDeleted: false,
  }).populate("createdBy", "username avatar");

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}