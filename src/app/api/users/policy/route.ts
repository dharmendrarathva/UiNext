import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/* GET POLICY STATUS */

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

    const user = await User.findById(session.user.id)
      .select("policyAccepted");

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      policyAccepted: user.policyAccepted ?? false,
    });

  } catch (error) {
    console.error("Policy GET error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}


/* ACCEPT POLICY */

export async function PATCH() {
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

    user.policyAccepted = true;
    user.policyAcceptedAt = new Date();
    user.policyVersion = "v1";

    await user.save();

    return NextResponse.json({
      success: true,
      policyAccepted: true,
    });

  } catch (error) {
    console.error("Policy PATCH error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}