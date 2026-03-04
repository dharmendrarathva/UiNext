import mongoose, { Schema, models, model } from "mongoose";
import { ProductStatus } from "@/lib/product-status";

const ProductSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    thumbnail: String,

    files: [String],

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: Object.values(ProductStatus),
      default: ProductStatus.DRAFT,
      index: true,
    },

    rejectionReason: {
      type: String,
      default: null,
    },

    likesCount: {
      type: Number,
      default: 0,
    },

    favoritesCount: {
      type: Number,
      default: 0,
    },

    commentsCount: {
      type: Number,
      default: 0,
    },

    viewsCount: {
      type: Number,
      default: 0,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    slug: {
  type: String,
  required: true,
  lowercase: true,
  index: true,
},

    deletedAt: Date,
  },
  { timestamps: true }
);

ProductSchema.index({ createdBy: 1, createdAt: -1 });
ProductSchema.index({ status: 1, createdAt: -1 });
ProductSchema.index(
  { createdBy: 1, slug: 1 },
  { unique: true }
);

export const Product =
  models.Product || model("Product", ProductSchema);