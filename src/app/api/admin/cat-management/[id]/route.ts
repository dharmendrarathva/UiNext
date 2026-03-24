import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Category } from "@/models/Category";

//////////////////////////////////////////////////////
// UPDATE CATEGORY
//////////////////////////////////////////////////////

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  try {

    const { id } = await params;

    await connectDB();

    const body = await req.json();

    const { name, icon } = body;

    //////////////////////////////////////////////////
    // UPDATE SLUG IF NAME CHANGED
    //////////////////////////////////////////////////

    let slug;

    if (name) {

      slug = name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, "");

    }

    const category = await Category.findByIdAndUpdate(
      id,
      {
        name,
        slug,
        icon,
      },
      { new: true }
    );

    return NextResponse.json(category);

  } catch (error) {

    console.error("CATEGORY UPDATE ERROR:", error);

    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );

  }

}

//////////////////////////////////////////////////////
// DELETE CATEGORY
//////////////////////////////////////////////////////

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  try {

    const { id } = await params;

    await connectDB();

    await Category.findByIdAndDelete(id);

    return NextResponse.json({ success: true });

  } catch (error) {

    console.error("CATEGORY DELETE ERROR:", error);

    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );

  }

}