// models/UserActivity.ts
import mongoose, { Schema, models, model } from "mongoose";

const UserActivitySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    ip: String,
    device: String,
    type: {
      type: String,
      enum: ["LOGIN", "PROFILE_UPDATE", "LOGOUT"],
    },
    location: {
      lat: Number,
      lng: Number,
      country: String,
      city: String,
    },
  },
  { timestamps: true }
);

export const UserActivity =
  models.UserActivity || model("UserActivity", UserActivitySchema);