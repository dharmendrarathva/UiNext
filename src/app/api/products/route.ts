import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const products = await Product.find({
      status: "APPROVED",
      isDeleted: false,
    })
      .populate("createdBy", "username")
      .sort({ createdAt: -1 });

    return NextResponse.json(products);
  } catch (error) {
    console.error("PRODUCT API ERROR:", error);

    return NextResponse.json(
      { error: "Failed to load products" },
      { status: 500 }
    );
  }
}