import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { ProductFavorite } from "@/models/ProductFavorite";
import { Product } from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();

  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const productId = params.id;

  const existing = await ProductFavorite.findOne({
    user: userId,
    product: productId,
  });

  if (existing) {
    // remove favorite
    await ProductFavorite.deleteOne({ _id: existing._id });

    await Product.updateOne(
      { _id: productId },
      { $inc: { favoritesCount: -1 } }
    );

    return NextResponse.json({ favorited: false });
  }

  await ProductFavorite.create({
    user: userId,
    product: productId,
  });

  await Product.updateOne(
    { _id: productId },
    { $inc: { favoritesCount: 1 } }
  );

  return NextResponse.json({ favorited: true });
}