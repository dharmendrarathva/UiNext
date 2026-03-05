import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Cart } from "@/models/Cart";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function DELETE(req: Request) {
  await connectDB();

  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { productId } = await req.json();

  const cart = await Cart.findOne({ user: session.user.id });

  if (!cart) {
    return NextResponse.json({ error: "Cart not found" }, { status: 404 });
  }

  cart.items = cart.items.filter(
    (item: any) => item.product.toString() !== productId
  );

  await cart.save();

  return NextResponse.json({ message: "Removed from cart" });
}