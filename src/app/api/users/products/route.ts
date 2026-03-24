import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { User } from "@/models/User";
import mongoose from "mongoose";
import { validateComponentCodes } from "@/lib/validateComponentCodes";

//////////////////////////////////////////////////////
// GET USER PRODUCTS
//////////////////////////////////////////////////////

export async function GET() {

  try {

    const session = await getServerSession(authOptions);

    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();

    const products = await Product.find({
      createdBy: session.user.id,
      isDeleted: false,
    })
      .populate("category", "name slug")
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



//////////////////////////////////////////////////////
// CREATE PRODUCT
//////////////////////////////////////////////////////

export async function POST(req: Request) {
  try {

    //////////////////////////////////////////////////////
    // SESSION CHECK
    //////////////////////////////////////////////////////

    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    //////////////////////////////////////////////////////
    // DB CONNECTION
    //////////////////////////////////////////////////////

    await connectDB();

    //////////////////////////////////////////////////////
    // USER VALIDATION
    //////////////////////////////////////////////////////

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

    //////////////////////////////////////////////////////
    // DAILY PRODUCT LIMIT (OPTIONAL)
    //////////////////////////////////////////////////////

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const productCountToday = await Product.countDocuments({
      createdBy: session.user.id,
      createdAt: { $gte: today },
      isDeleted: false,
    });

    if (productCountToday >= 10) {
      return NextResponse.json(
        { error: "Daily limit reached. You can create only 10 products per day." },
        { status: 429 }
      );
    }

    //////////////////////////////////////////////////////
    // PARSE BODY
    //////////////////////////////////////////////////////

    let body;

    try {
      body = await req.json();
    } catch (err) {
      console.error("Invalid JSON:", err);

      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const { title, category, status, codes } = body;

    console.log("CREATE PRODUCT BODY:", body);

    //////////////////////////////////////////////////////
    // BASIC VALIDATION
    //////////////////////////////////////////////////////

    if (!title || !category) {
      return NextResponse.json(
        { error: "Title and category are required." },
        { status: 400 }
      );
    }

    if (typeof title !== "string" || title.trim().length < 3) {
      return NextResponse.json(
        { error: "Title must be at least 3 characters." },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(category)) {
      return NextResponse.json(
        { error: "Invalid category selected." },
        { status: 400 }
      );
    }

    //////////////////////////////////////////////////////
    // COMPONENT CODE VALIDATION
    //////////////////////////////////////////////////////

    if (!validateComponentCodes(codes)) {
      return NextResponse.json(
        {
          error:
            "Invalid component code format. Only one implementation type allowed (HTML/CSS/JS OR Tailwind).",
        },
        { status: 400 }
      );
    }

    //////////////////////////////////////////////////////
    // CREATE PRODUCT
    //////////////////////////////////////////////////////

    const product = await Product.create({
      title: title.trim(),
      category,
      createdBy: session.user.id,
      status: status ?? "DRAFT",
      codes,
    });

    //////////////////////////////////////////////////////
    // RESPONSE
    //////////////////////////////////////////////////////

    return NextResponse.json(product, { status: 201 });

  } catch (error) {

    console.error("CREATE PRODUCT ERROR:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );

  }
}