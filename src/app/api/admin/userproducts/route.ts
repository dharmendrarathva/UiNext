import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({}, { status: 401 });
  }

  if (session.user.role !== "ADMIN") {
    return NextResponse.json({}, { status: 403 });
  }

  await connectDB();

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  //////////////////////////////////////////////////////
  // QUERY
  //////////////////////////////////////////////////////

  const query: any = {};

  if (status === "ARCHIVED") {
    query.isDeleted = true;
  } else {
    query.isDeleted = false;

    if (status && status !== "ALL") {
      query.status = status;
    }
  }

  //////////////////////////////////////////////////////
  // FETCH PRODUCTS
  //////////////////////////////////////////////////////

  const products = await Product.find(query)
    .populate("createdBy", "username email")
    .populate("category", "name slug icon")
    .sort({ createdAt: -1 });

  return NextResponse.json(products);
}