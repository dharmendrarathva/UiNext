import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Cart } from "@/models/Cart";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  await connectDB();

  const session = await getServerSession(authOptions);

 if (!session?.user?.id) {
  return NextResponse.json(
    { error: "Unauthorized" },
    { status: 401 }
  );
}
  const cart = await Cart.findOne({ user: session.user.id })
    .populate({
  path: "items.product",
  select: "title slug  createdBy",
  populate: {
    path: "createdBy",
    select: "username",
  },
})
    .lean();

return NextResponse.json({
  items: cart?.items ?? []
});}