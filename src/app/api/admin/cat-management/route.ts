import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Category } from "@/models/Category";

export async function GET() {

  await connectDB();

  const categories = await Category.find().sort({ createdAt: -1 });

  return NextResponse.json(categories);
}

export async function POST(req: Request) {

  await connectDB();

  const body = await req.json();

  const category = await Category.create({
    name: body.name,
    description: body.description,
    icon: body.icon,
  });

  return NextResponse.json(category);
}