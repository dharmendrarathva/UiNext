import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Category } from "@/models/Category";

export async function GET() {
  await connectDB();

  const categories = await Category.find()
    .select("name slug description icon")
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json(categories);
}



import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  await connectDB();

  const body = await req.json();

  const slug = body.name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");

  const category = await Category.create({
    name: body.name,
    slug,
    description: body.description,
    icon: body.icon,
  });

  return NextResponse.json(category);
}