import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Category } from "@/models/Category";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  const { id } = await params;

  await connectDB();

  const body = await req.json();

  const category = await Category.findByIdAndUpdate(
    id,
    {
      name: body.name,
      description: body.description,
      icon: body.icon,
    },
    { new: true }
  );

  return NextResponse.json(category);
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  const { id } = await params;

  await connectDB();

  await Category.findByIdAndDelete(id);

  return NextResponse.json({ success: true });
}