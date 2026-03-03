import mongoose, { Schema, models, model } from "mongoose";

const ProductLikeSchema = new Schema(
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

ProductLikeSchema.index({ user: 1, product: 1 }, { unique: true });

export const ProductLike =
  models.ProductLike || model("ProductLike", ProductLikeSchema);