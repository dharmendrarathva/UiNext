import mongoose, { Schema, models, model } from "mongoose";

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },

    description: {
      type: String,
      maxlength: 500,
    },

    icon: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Category =
  models.Category || model("Category", CategorySchema);