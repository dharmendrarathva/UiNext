import mongoose, { Schema, models, model } from "mongoose";

const ProductFavoriteSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true }
);

ProductFavoriteSchema.index({ user: 1, product: 1 }, { unique: true });

export const ProductFavorite =
  models.ProductFavorite ||
  model("ProductFavorite", ProductFavoriteSchema);