import "@/models/Category";
import "@/models/Product";

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

import { Product } from "@/models/Product";
import { ProductLike } from "@/models/ProductLike";
import { ProductFavorite } from "@/models/ProductFavorite";

export async function GET() {
  try {

    await connectDB();

    //////////////////////////////////////////////////
    // RUN TOTAL QUERIES IN PARALLEL
    //////////////////////////////////////////////////

    const [
      totalProducts,
      viewsAgg,
      totalLikes,
      totalFavorites,
    ] = await Promise.all([
      Product.countDocuments({
        status: "APPROVED",
        isDeleted: false,
      }),

      Product.aggregate([
        { $match: { status: "APPROVED", isDeleted: false } },
        { $group: { _id: null, views: { $sum: "$viewsCount" } } },
      ]),

      ProductLike.countDocuments(),
      ProductFavorite.countDocuments(),
    ]);

    //////////////////////////////////////////////////
    // PRODUCT PERFORMANCE
    //////////////////////////////////////////////////

    const productStats = await Product.aggregate([
      {
        $match: {
          status: "APPROVED",
          isDeleted: false,
        },
      },

      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },

      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },

      {
        $project: {
          title: 1,
          viewsCount: 1,
          likesCount: 1,
          favoritesCount: 1,
          commentsCount: 1,
          category: "$category.name",
        },
      },

      { $sort: { viewsCount: -1 } },

      { $limit: 20 }, // prevent large responses
    ]);

    //////////////////////////////////////////////////
    // CATEGORY PERFORMANCE
    //////////////////////////////////////////////////

    const categoryStats = await Product.aggregate([
      {
        $match: {
          status: "APPROVED",
          isDeleted: false,
        },
      },

      {
        $group: {
          _id: "$category",
          products: { $sum: 1 },
          views: { $sum: "$viewsCount" },
        },
      },

      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "category",
        },
      },

      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },

      {
        $project: {
          _id: 0,
          name: "$category.name",
          products: 1,
          views: 1,
        },
      },

      { $sort: { views: -1 } },
    ]);

    //////////////////////////////////////////////////
    // SAFE RESPONSE
    //////////////////////////////////////////////////

    return NextResponse.json({
      totals: {
        products: totalProducts ?? 0,
        views: viewsAgg?.[0]?.views ?? 0,
        likes: totalLikes ?? 0,
        favorites: totalFavorites ?? 0,
      },
      products: productStats ?? [],
      categories: categoryStats ?? [],
    });

  } catch (error) {

    console.error("STATS API ERROR:", error);

    return NextResponse.json(
      {
        totals: {
          products: 0,
          views: 0,
          likes: 0,
          favorites: 0,
        },
        products: [],
        categories: [],
      },
      { status: 500 }
    );

  }
}