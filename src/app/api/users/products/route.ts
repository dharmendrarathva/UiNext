import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { User } from "@/models/User";
import mongoose from "mongoose";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const products = await Product.find({
      createdBy: session.user.id,
      isDeleted: false,
    })
      .populate("category", "name slug")
      .sort({ createdAt: -1 });

    return NextResponse.json(products);

  } catch (error) {

    console.error("Products GET error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );

  }
}



export async function POST(req: Request) {

  try {

    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.isBlocked) {
      return NextResponse.json({ error: "Account blocked" }, { status: 403 });
    }

    if (!user.policyAccepted) {
      return NextResponse.json(
        { error: "You must accept the creator policy before creating products." },
        { status: 403 }
      );
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

    const { title, description, price, category, status } = body;

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

    /* ---------------- CREATE PRODUCT ---------------- */

    const product = await Product.create({
      title: title.trim(),
      description: description.trim(),
      price: Number(price),
      category,
      createdBy: session.user.id,
      status: status ?? "DRAFT",
    });

    return NextResponse.json(product, { status: 201 });

  } catch (error) {

    console.error("Product POST error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );

  }
}