import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";
import { User } from "@/models/User";
import { Product } from "@/models/Product";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await connectDB();

  const user = await User.findById(id).select(
    "name username image bio website followersCount followingCount"
  );

  if (!user) {
    return NextResponse.json({}, { status: 404 });
  }

  const products = await Product.find({
    createdBy: id,
    status: "APPROVED",
    isDeleted: false,
  })
    .select("title slug price thumbnail")
    .sort({ createdAt: -1 });

  return NextResponse.json({
    user,
    products,
  });
}