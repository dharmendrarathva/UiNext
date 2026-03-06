import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";

import { User } from "@/models/User";
import { Product } from "@/models/Product";
import { Follow } from "@/models/Follow";
import { ProductLike } from "@/models/ProductLike";
import { ProductFavorite } from "@/models/ProductFavorite";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  const { id } = await params;

  await connectDB();

  ////////////////////////////////////////////////////
  // SESSION
  ////////////////////////////////////////////////////

  const session = await getServerSession(authOptions);
  const currentUserId = session?.user?.id;

  ////////////////////////////////////////////////////
  // USER
  ////////////////////////////////////////////////////

  const user = await User.findById(id).select(
    "name username image bio website followersCount followingCount"
  );

  if (!user) {
    return NextResponse.json({}, { status: 404 });
  }

  ////////////////////////////////////////////////////
  // FOLLOW STATUS
  ////////////////////////////////////////////////////

  let isFollowing = false;

  if (currentUserId) {

    const follow = await Follow.findOne({
      follower: currentUserId,
      following: id,
    });

    isFollowing = !!follow;

  }

  ////////////////////////////////////////////////////
  // PRODUCTS
  ////////////////////////////////////////////////////

  const products = await Product.find({
    createdBy: id,
    status: "APPROVED",
    isDeleted: false,
  })
    .populate("createdBy", "username")
    .sort({ createdAt: -1 })
    .lean();

  ////////////////////////////////////////////////////
  // IF USER NOT LOGGED IN
  ////////////////////////////////////////////////////

  if (!currentUserId) {

    const result = products.map((p:any) => ({
      ...p,
      liked: false,
      saved: false,
    }));

    return NextResponse.json({
      user: {
        ...user.toObject(),
        isFollowing,
      },
      products: result,
    });

  }

  ////////////////////////////////////////////////////
  // GET USER INTERACTIONS
  ////////////////////////////////////////////////////

  const likes = await ProductLike.find({
    user: currentUserId,
  }).select("product");

  const favorites = await ProductFavorite.find({
    user: currentUserId,
  }).select("product");

  const likedIds = new Set(likes.map((l:any)=>l.product.toString()));
  const savedIds = new Set(favorites.map((f:any)=>f.product.toString()));

  ////////////////////////////////////////////////////
  // ATTACH FLAGS
  ////////////////////////////////////////////////////

  const result = products.map((p:any)=>({

    ...p,

    liked: likedIds.has(p._id.toString()),
    saved: savedIds.has(p._id.toString()),

  }));

  ////////////////////////////////////////////////////
  // RESPONSE
  ////////////////////////////////////////////////////

  return NextResponse.json({

    user: {
      ...user.toObject(),
      isFollowing,
    },

    products: result,

  });

}