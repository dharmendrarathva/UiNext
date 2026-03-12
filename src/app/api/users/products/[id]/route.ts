import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import mongoose from "mongoose";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {

    const { id } = await params;

    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (product.createdBy.toString() !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    let body;

    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const { title, description, price, category } = body;

    /* ---------------- VALIDATION ---------------- */

    if (!title || !description || !price || !category) {
      return NextResponse.json(
        { error: "All fields (title, description, price, category) are required." },
        { status: 400 }
      );
    }

    if (typeof title !== "string" || title.trim().length < 3) {
      return NextResponse.json(
        { error: "Title must be at least 3 characters." },
        { status: 400 }
      );
    }

    if (typeof description !== "string" || description.trim().length < 10) {
      return NextResponse.json(
        { error: "Description must be at least 10 characters." },
        { status: 400 }
      );
    }

    if (Number(price) <= 0) {
      return NextResponse.json(
        { error: "Price must be greater than 0." },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(category)) {
      return NextResponse.json(
        { error: "Invalid category selected." },
        { status: 400 }
      );
    }

    /* ---------------- UPDATE PRODUCT ---------------- */

    product.set({
      title: title.trim(),
      description: description.trim(),
      price: Number(price),
      category,
      status: "PENDING",        // resubmitted for review
      rejectionReason: null,    // clear previous rejection
    });

    await product.save();

    return NextResponse.json(product);

  } catch (error) {

    console.error("Product UPDATE error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );

  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({}, { status: 401 });

  await connectDB();

  const product = await Product.findById(id);

  if (!product) return NextResponse.json({}, { status: 404 });

  if (product.createdBy.toString() !== session.user.id)
    return NextResponse.json({}, { status: 403 });

  product.isDeleted = true;
  product.deletedAt = new Date();

  await product.save();

  return NextResponse.json({ success: true });
}