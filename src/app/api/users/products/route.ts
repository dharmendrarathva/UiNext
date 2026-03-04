import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) return NextResponse.json({}, { status: 401 });

  await connectDB();

  const products = await Product.find({
    createdBy: session.user.id,
    isDeleted: false,
  }).sort({ createdAt: -1 });

  return NextResponse.json(products);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) return NextResponse.json({}, { status: 401 });

  if (session.user.isBlocked)
    return NextResponse.json({}, { status: 403 });

  await connectDB();

  const body = await req.json();

 const product = await Product.create({
  ...body,
  createdBy: session.user.id,
  status: body.status ?? "DRAFT",
});

  return NextResponse.json(product);
}