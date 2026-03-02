// models/Notification.ts
import mongoose, { Schema, models, model } from "mongoose";

const NotificationSchema = new Schema(
  {
    to: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    fromAdmin: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    title: String,
    message: String,
    type: {
      type: String,
      enum: ["WARNING", "INFO", "BLOCK_NOTICE"],
    },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Notification =
  models.Notification || model("Notification", NotificationSchema);