import mongoose, { Schema, models, model } from "mongoose";

const CommentLikeSchema = new Schema(
{
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  comment: {
    type: Schema.Types.ObjectId,
    ref: "ProductComment",
    required: true,
  },

},
{ timestamps: true }
);

CommentLikeSchema.index({ user:1, comment:1 }, { unique:true });

export const CommentLike =
models.CommentLike ||
model("CommentLike", CommentLikeSchema);