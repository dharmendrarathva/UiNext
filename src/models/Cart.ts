import mongoose, { Schema, models, model } from "mongoose";

const CartItemSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

   
  },
  { _id: false }
);

const CartSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true,
      index: true,
    },

    items: [CartItemSchema],
  },
  { timestamps: true }
);

export const Cart =
  models.Cart || model("Cart", CartSchema);