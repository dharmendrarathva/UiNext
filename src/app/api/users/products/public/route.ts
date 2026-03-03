
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";

export async function GET() {
  await connectDB();

  const products = await Product.find({
    status: "APPROVED",
    visibility: "PUBLIC",
    isDeleted: false,
  })
    .populate("category")
    .populate("owner", "name image")
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json(products);
}