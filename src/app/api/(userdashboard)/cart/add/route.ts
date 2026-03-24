import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Cart } from "@/models/Cart";
import { Product } from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  await connectDB();

  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { productId } = await req.json();

  const product = await Product.findById(productId);

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  let cart = await Cart.findOne({ user: session.user.id });

  if (!cart) {
    cart = await Cart.create({
      user: session.user.id,
      items: [],
    });
  }

  const already = cart.items.find(
    (i: any) => i.product.toString() === productId
  );

  if (already) {
    return NextResponse.json({ message: "Already in cart" });
  }

  cart.items.push({
    product: product._id,
  });

  await cart.save();

  return NextResponse.json({ message: "Added to cart" });
}