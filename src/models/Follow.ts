import mongoose, { Schema, models, model } from "mongoose";

const FollowSchema = new Schema(
  {
    follower: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    following: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate follow
FollowSchema.index({ follower: 1, following: 1 }, { unique: true });

// Optimized for listing followers
FollowSchema.index({ following: 1, createdAt: -1 });

export const Follow =
  models.Follow || model("Follow", FollowSchema);