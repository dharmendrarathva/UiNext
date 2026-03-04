import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) return NextResponse.json({}, { status: 401 });

  if (session.user.role !== "ADMIN")
    return NextResponse.json({}, { status: 403 });

  await connectDB();

  const products = await Product.find({
    status: "PENDING",
    isDeleted: false,
  }).populate("createdBy", "username email");

  return NextResponse.json(products);
}