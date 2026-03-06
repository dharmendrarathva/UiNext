import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { User } from "@/models/User";

export async function GET() {
  try {

    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

const products = await Product.find({
  createdBy: session.user.id,
  isDeleted: false,
}).populate("category", "name slug")
.sort({ createdAt: -1 });

    return NextResponse.json(products);

  } catch (error) {
    console.error("Products GET error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// export async function POST(req: Request) {
//   const session = await getServerSession(authOptions);

//   if (!session) return NextResponse.json({}, { status: 401 });

//   if (session.user.isBlocked)
//     return NextResponse.json({}, { status: 403 });

//   await connectDB();

//   const body = await req.json();

//  const product = await Product.create({
//   ...body,
//   createdBy: session.user.id,
//   status: body.status ?? "DRAFT",
// });

//   return NextResponse.json(product);
// }




export async function POST(req: Request) {
  try {

    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (user.isBlocked) {
      return NextResponse.json(
        { error: "Account blocked" },
        { status: 403 }
      );
    }

    if (!user.policyAccepted) {
      return NextResponse.json(
        { error: "You must accept the creator policy before creating products." },
        { status: 403 }
      );
    }

    let body;

    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const product = await Product.create({
      ...body,
      createdBy: session.user.id,
      status: body.status ?? "DRAFT",
    });

    return NextResponse.json(product);

  } catch (error) {
    console.error("Product POST error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}