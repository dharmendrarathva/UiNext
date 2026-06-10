import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import mongoose from "mongoose";
import { validateComponentCodes } from "@/lib/validateComponentCodes";


export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  try {

    const { id } = await params;

    const session = await getServerSession(authOptions);

    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();

    const product = await Product.findById(id)
      .populate("category", "name slug");

    if (!product)
      return NextResponse.json({ error: "Product not found" }, { status: 404 });

    if (product.createdBy.toString() !== session.user.id)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    return NextResponse.json(product);

  } catch (error) {

    console.error("GET PRODUCT error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );

  }

}


//////////////////////////////////////////////////////
// UPDATE PRODUCT
//////////////////////////////////////////////////////

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  try {

    const { id } = await params;

    const session = await getServerSession(authOptions);

    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();

    const product = await Product.findById(id);

    if (!product)
      return NextResponse.json({ error: "Product not found" }, { status: 404 });

    if (product.createdBy.toString() !== session.user.id)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    //////////////////////////////////////////////////////
    // PARSE BODY
    //////////////////////////////////////////////////////

    let body;

    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

const { title, category, codes, status } = body;
    //////////////////////////////////////////////////////
    // VALIDATION
    //////////////////////////////////////////////////////

    if (!title || !category)
      return NextResponse.json(
        { error: "All fields (title, category) are required." },
        { status: 400 }
      );

    if (typeof title !== "string" || title.trim().length < 3)
      return NextResponse.json(
        { error: "Title must be at least 3 characters." },
        { status: 400 }
      );

    if (!mongoose.Types.ObjectId.isValid(category))
      return NextResponse.json(
        { error: "Invalid category selected." },
        { status: 400 }
      );

    //////////////////////////////////////////////////////
    // CODE VALIDATION
    //////////////////////////////////////////////////////

    if (!validateComponentCodes(codes))
      return NextResponse.json(
        {
          message:
            "Invalid component code format. Provide exactly one implementation type.",
        },
        { status: 400 }
      );

    //////////////////////////////////////////////////////
    // UPDATE PRODUCT
    //////////////////////////////////////////////////////

    product.set({
      title: title.trim(),
      category,
      codes,
status: status ?? product.status,
      rejectionReason: null,
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

//////////////////////////////////////////////////////
// SOFT DELETE PRODUCT
//////////////////////////////////////////////////////

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