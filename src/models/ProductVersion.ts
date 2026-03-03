import mongoose, { Schema, models, model } from "mongoose";

export enum VersionStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

const ProductVersionSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },

    versionNumber: {
      type: Number,
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
    },

    htmlCode: String,
    cssCode: String,
    jsCode: String,
    tailwindCode: String,
    reactCode: String,
    nextjsCode: String,

    metadata: Schema.Types.Mixed,

    status: {
      type: String,
      enum: Object.values(VersionStatus),
      default: VersionStatus.PENDING,
      index: true,
    },

    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    reviewedAt: Date,
    reviewComment: String,
  },
  { timestamps: true }
);

// Prevent duplicate version numbers
ProductVersionSchema.index(
  { product: 1, versionNumber: 1 },
  { unique: true }
);

export const ProductVersion =
  models.ProductVersion ||
  model("ProductVersion", ProductVersionSchema);