import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(
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

  product.status = "PENDING";

  await product.save();

  return NextResponse.json(product);
}