import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Product, ProductStatus } from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const body = await req.json();

  const product = await Product.create({
    owner: session.user.id,
    category: body.category,
    status: ProductStatus.PENDING, // 🔒 forced
    visibility: "PRIVATE",
  });

  return NextResponse.json(product);
}