import mongoose, { Schema, models, model } from "mongoose";

export enum ProductStatus {
  DRAFT = "DRAFT",
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  ARCHIVED = "ARCHIVED",
}

export enum VisibilityStatus {
  PRIVATE = "PRIVATE",
  PUBLIC = "PUBLIC",
}

const ProductSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },

    currentVersion: {
      type: Schema.Types.ObjectId,
      ref: "ProductVersion",
    },

    status: {
      type: String,
      enum: Object.values(ProductStatus),
      default: ProductStatus.DRAFT,
      index: true,
    },

    visibility: {
      type: String,
      enum: Object.values(VisibilityStatus),
      default: VisibilityStatus.PRIVATE,
      index: true,
    },

    rejectionReason: {
      type: String,
    },

    likesCount: { type: Number, default: 0 },
    favoritesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    viewsCount: { type: Number, default: 0 },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

// Feed optimization
ProductSchema.index({ status: 1, visibility: 1, createdAt: -1 });
ProductSchema.index({ owner: 1, createdAt: -1 });

export const Product =
  models.Product || model("Product", ProductSchema);