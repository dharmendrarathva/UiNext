// import mongoose, { Schema, models, model, HydratedDocument } from "mongoose";
// import slugify from "slugify";
// import { ProductStatus } from "@/lib/product-status";



// interface ProductDoc {
//   title: string;
//   slug: string;
//   category: mongoose.Types.ObjectId;
//   createdBy: mongoose.Types.ObjectId;
//   status: ProductStatus;
//   rejectionReason?: string | null;
//   likesCount: number;
//   favoritesCount: number;
//   commentsCount: number;
//   viewsCount: number;
//   isDeleted: boolean;
//   deletedAt?: Date; 
// }



// const ProductSchema = new Schema<ProductDoc>(
//   {
//     title: {
//       type: String,
//       required: true,
//       trim: true,
//       index: true,
//     },

//     slug: {
//       type: String,
//       lowercase: true,
//       index: true,
//     },
// category: {
//   type: Schema.Types.ObjectId,
//   ref: "Category",
//   required: true,
//   index: true,
// },


//     createdBy: {
//       type: Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//       index: true,
//     },

//     status: {
//       type: String,
//       enum: Object.values(ProductStatus),
//       default: ProductStatus.DRAFT,
//       index: true,
//     },

//     rejectionReason: {
//       type: String,
//       default: null,
//     },

//     likesCount: {
//       type: Number,
//       default: 0,
//     },

//     favoritesCount: {
//       type: Number,
//       default: 0,
//     },

//     commentsCount: {
//       type: Number,
//       default: 0,
//     },

//     viewsCount: {
//       type: Number,
//       default: 0,
//     },

//     isDeleted: {
//       type: Boolean,
//       default: false,
//       index: true,
//     },

//     deletedAt: Date,
//   },
//   { timestamps: true }
// );

// //////////////////////////////////////////////////////
// // AUTO SLUG GENERATION
// //////////////////////////////////////////////////////

// ProductSchema.pre("save", async function (this: HydratedDocument<ProductDoc>) {

//   if (!this.isModified("title")) return;

//   const baseSlug = slugify(this.title, {
//     lower: true,
//     strict: true,
//   });

//   let slug = baseSlug;
//   let counter = 1;

//   const ProductModel = mongoose.models.Product;

//   while (
//     await ProductModel.findOne({
//       slug,
//       createdBy: this.createdBy,
//       _id: { $ne: this._id },
//     })
//   ) {
//     slug = `${baseSlug}-${counter}`;
//     counter++;
//   }

//   this.slug = slug;

// });

// //////////////////////////////////////////////////////
// // INDEXES
// //////////////////////////////////////////////////////

// ProductSchema.index({ createdBy: 1, createdAt: -1 });
// ProductSchema.index({ status: 1, createdAt: -1 });
// ProductSchema.index({ createdBy: 1, slug: 1 }, { unique: true });

// //////////////////////////////////////////////////////
// // EXPORT MODEL
// //////////////////////////////////////////////////////

// export const Product =
//   models.Product || model<ProductDoc>("Product", ProductSchema);



import mongoose, { Schema, models, model, HydratedDocument } from "mongoose";
import slugify from "slugify";
import { ProductStatus } from "@/lib/product-status";

interface ProductDoc {
  title: string;
  slug: string;

 codes?: {
  html?: string
  css?: string
  js?: string

  react?: string
  next?: string
  tailwind?: string
}

  category: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;

  status: ProductStatus;
  rejectionReason?: string | null;

  likesCount: number;
  favoritesCount: number;
  commentsCount: number;
  viewsCount: number;

  isDeleted: boolean;
  deletedAt?: Date;
}

const ProductSchema = new Schema<ProductDoc>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    slug: {
      type: String,
      lowercase: true,
      index: true,
    },

   codes: {
  html: { type: String },
  css: { type: String },
  js: { type: String },

  react: { type: String },
  next: { type: String },
  tailwind: { type: String },
},

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: Object.values(ProductStatus),
      default: ProductStatus.DRAFT,
      index: true,
    },

    rejectionReason: {
      type: String,
      default: null,
    },

    likesCount: {
      type: Number,
      default: 0,
    },

    favoritesCount: {
      type: Number,
      default: 0,
    },

    commentsCount: {
      type: Number,
      default: 0,
    },

    viewsCount: {
      type: Number,
      default: 0,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },

    deletedAt: Date,
  },
  { timestamps: true }
);

//////////////////////////////////////////////////////
// AUTO SLUG GENERATION
//////////////////////////////////////////////////////

ProductSchema.pre("save", async function (this: HydratedDocument<ProductDoc>) {

  if (!this.isModified("title")) return;

  const baseSlug = slugify(this.title, {
    lower: true,
    strict: true,
  });

  let slug = baseSlug;
  let counter = 1;

  const ProductModel = mongoose.models.Product;

  while (
    await ProductModel.findOne({
      slug,
      createdBy: this.createdBy,
      _id: { $ne: this._id },
    })
  ) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  this.slug = slug;

});

//////////////////////////////////////////////////////
// INDEXES
//////////////////////////////////////////////////////

ProductSchema.index({ createdBy: 1, createdAt: -1 });
ProductSchema.index({ status: 1, createdAt: -1 });
ProductSchema.index({ createdBy: 1, slug: 1 }, { unique: true });

//////////////////////////////////////////////////////
// EXPORT MODEL
//////////////////////////////////////////////////////

export const Product =
  models.Product || model<ProductDoc>("Product", ProductSchema);