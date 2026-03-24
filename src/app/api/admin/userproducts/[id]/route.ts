import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

//////////////////////////////////////////////////////
// AUTH CHECK
//////////////////////////////////////////////////////

async function checkAdmin() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return { error: NextResponse.json({}, { status: 401 }) };
  }

  if (session.user.role !== "ADMIN") {
    return { error: NextResponse.json({}, { status: 403 }) };
  }

  return { session };
}

//////////////////////////////////////////////////////
// GET SINGLE PRODUCT
//////////////////////////////////////////////////////

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await checkAdmin();
  if (error) return error;

  const { id } = await params;

  await connectDB();

  const product = await Product.findById(id)
    .populate("createdBy", "username email")
    .populate("category", "name slug icon");

  if (!product) {
    return NextResponse.json({}, { status: 404 });
  }

  return NextResponse.json(product);
}

//////////////////////////////////////////////////////
// UPDATE PRODUCT
//////////////////////////////////////////////////////

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await checkAdmin();
  if (error) return error;

  const { id } = await params;

  await connectDB();

  const body = await req.json();

  const product = await Product.findById(id);

  if (!product) {
    return NextResponse.json({}, { status: 404 });
  }

  //////////////////////////////////////////////////////
  // MODERATION
  //////////////////////////////////////////////////////

  if (body.action === "APPROVE") {
    product.status = "APPROVED";
    product.rejectionReason = null;
  }

  if (body.action === "REJECT") {
    product.status = "REJECTED";
    product.rejectionReason = body.rejectionReason || null;
  }

  //////////////////////////////////////////////////////
  // EDITABLE FIELDS
  //////////////////////////////////////////////////////

  if (body.title !== undefined) product.title = body.title;
  if (body.slug !== undefined) product.slug = body.slug;
  if (body.description !== undefined) product.description = body.description;

  if (body.category !== undefined) product.category = body.category;

  if (body.images !== undefined) product.images = body.images;

  if (body.tags !== undefined) product.tags = body.tags;

  if (body.files !== undefined) product.files = body.files;

  if (body.codes !== undefined) product.codes = body.codes;

  if (body.isFeatured !== undefined) product.isFeatured = body.isFeatured;

  await product.save();

  const populatedProduct = await Product.findById(id)
    .populate("createdBy", "username email")
    .populate("category", "name slug icon");

  return NextResponse.json(populatedProduct);
}

//////////////////////////////////////////////////////
// ARCHIVE PRODUCT
//////////////////////////////////////////////////////

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await checkAdmin();
  if (error) return error;

  const { id } = await params;

  await connectDB();

  const product = await Product.findById(id);

  if (!product) {
    return NextResponse.json({}, { status: 404 });
  }

  product.isDeleted = true;

  await product.save();

  return NextResponse.json({ success: true });
}