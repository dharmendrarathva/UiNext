import mongoose, { Schema, models, model } from "mongoose";

const ProductCommentSchema = new Schema(
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
    required: true,
  },

  content: {
  type: String,
  required: true,
  trim: true,
  maxlength: 300
},

  parent: {
    type: Schema.Types.ObjectId,
    ref: "ProductComment",
    default: null,
    index: true,
  },

  likesCount: {
    type: Number,
    default: 0,
  },

  isEdited: {
    type: Boolean,
    default: false,
  },

  isAdminComment: {
    type: Boolean,
    default: false,
  },

  isDeleted: {
    type: Boolean,
    default: false,
    index: true,
  },

},
{ timestamps: true }
);

ProductCommentSchema.index({ product: 1, createdAt: -1 });

export const ProductComment =
models.ProductComment ||
model("ProductComment", ProductCommentSchema);