import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Category } from "@/models/Category";

//////////////////////////////////////////////////////////
// GET ALL CATEGORIES
//////////////////////////////////////////////////////////

export async function GET() {
  try {

    await connectDB();

    const categories = await Category
      .find()
      .sort({ createdAt: -1 })
      .lean();

    const result = categories.map((cat: any) => ({
      _id: cat._id.toString(),
      name: cat.name,
      slug: cat.slug,
      icon: cat.icon || "",
    }));

    return NextResponse.json(result);

  } catch (error) {

    console.error("CATEGORY FETCH ERROR:", error);

    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );

  }
}

//////////////////////////////////////////////////////////
// CREATE CATEGORY
//////////////////////////////////////////////////////////

export async function POST(req: Request) {

  try {

    await connectDB();

    const body = await req.json();

    const { name, icon } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Category name required" },
        { status: 400 }
      );
    }

    //////////////////////////////////////////////////////
    // CREATE SLUG
    //////////////////////////////////////////////////////

    const slug = name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "");

    //////////////////////////////////////////////////////
    // CHECK DUPLICATE
    //////////////////////////////////////////////////////

    const exists = await Category.findOne({ slug });

    if (exists) {
      return NextResponse.json(
        { error: "Category already exists" },
        { status: 409 }
      );
    }

    //////////////////////////////////////////////////////
    // CREATE
    //////////////////////////////////////////////////////

    const category = await Category.create({
      name,
      slug,
      icon,
    });

    return NextResponse.json({
      _id: category._id.toString(),
      name: category.name,
      slug: category.slug,
      icon: category.icon,
    });

  } catch (error) {

    console.error("CATEGORY CREATE ERROR:", error);
    
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );

  }

}