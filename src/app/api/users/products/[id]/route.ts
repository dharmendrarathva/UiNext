import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Product , ProductStatus } from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  await connectDB();
  const body = await req.json();

  const updated = await Product.findByIdAndUpdate(
    id,
    body,
    { returnDocument: "after" }
  );

  return NextResponse.json(updated);
}




export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const product = await Product.findById(id);

  if (!product) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  // 🔒 Must be owner
  if (product.owner.toString() !== session.user.id) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  // 🔒 Cannot delete approved product
  if (product.status === ProductStatus.APPROVED) {
    return NextResponse.json(
      { message: "Approved product cannot be deleted" },
      { status: 400 }
    );
  }

  product.isDeleted = true;
  await product.save();

  return NextResponse.json({ message: "Deleted" });
}