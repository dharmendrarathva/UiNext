import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const session = await getServerSession(authOptions);

  if (!session) return NextResponse.json({}, { status: 401 });

  if (session.user.role !== "ADMIN")
    return NextResponse.json({}, { status: 403 });

  await connectDB();

  const { action, rejectionReason } = await req.json();

  const product = await Product.findById(id);

  if (!product) return NextResponse.json({}, { status: 404 });

  if (action === "APPROVE") {
    product.status = "APPROVED";
    product.rejectionReason = null;
  }

  if (action === "REJECT") {
    product.status = "REJECTED";
    product.rejectionReason = rejectionReason;
  }

  await product.save();

const populatedProduct = await Product.findById(id)
  .populate("createdBy", "username email")
  .populate("category", "name slug");

return NextResponse.json(populatedProduct);
}