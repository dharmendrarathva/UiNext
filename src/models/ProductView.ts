import mongoose, { Schema, models, model } from "mongoose";

const ProductViewSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    ipAddress: {
      type: String,
    },

    userAgent: {
      type: String,
    },
  },
  { timestamps: true }
);

//////////////////////////////////////////////////////
// INDEXES
//////////////////////////////////////////////////////

// prevent duplicate views from same user
ProductViewSchema.index(
  { product: 1, user: 1 },
  {
    unique: true,
    partialFilterExpression: { user: { $exists: true } },
  }
);

// allow anonymous views but avoid same IP spam
ProductViewSchema.index({ product: 1, ipAddress: 1 });

//////////////////////////////////////////////////////
// EXPORT
//////////////////////////////////////////////////////

export const ProductView =
  models.ProductView || model("ProductView", ProductViewSchema);