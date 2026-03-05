import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import { ProductView } from "@/models/ProductView";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json({ error: "ProductId required" }, { status: 400 });
    }

    const userId = session?.user?.id || null;

    const ip =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const existing = await ProductView.findOne({
      product: productId,
      ...(userId ? { user: userId } : { ipAddress: ip }),
    });

    if (existing) {
      const product = await Product.findById(productId).select("viewsCount");

      return NextResponse.json({
        views: product?.viewsCount || 0,
      });
    }

    await ProductView.create({
      product: productId,
      user: userId,
      ipAddress: ip,
      userAgent: req.headers.get("user-agent"),
    });

    const product = await Product.findByIdAndUpdate(
      productId,
      { $inc: { viewsCount: 1 } },
      { new: true }
    ).select("viewsCount");

    return NextResponse.json({
      views: product?.viewsCount || 0,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "View error" }, { status: 500 });
  }
}