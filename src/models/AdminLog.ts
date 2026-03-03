import mongoose, { Schema, models, model } from "mongoose";

const AdminLogSchema = new Schema(
  {
    admin: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },

    version: {
      type: Schema.Types.ObjectId,
      ref: "ProductVersion",
    },

    action: {
      type: String,
      required: true,
    },

    reason: String,
  },
  { timestamps: true }
);

export const AdminLog =
  models.AdminLog || model("AdminLog", AdminLogSchema);