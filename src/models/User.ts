











import mongoose, { Schema, models, model } from "mongoose";

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
  SUPERADMIN = "SUPERADMIN",
}

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },

    image: {
      type: String,
    },

    username: {
      type: String,
      lowercase: true,
      trim: true,
    },

    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
      index: true,
    },

    isBlocked: {
      type: Boolean,
      default: false,
      index: true,
    },

    blockReason: {
      type: String,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },

    bio: {
      type: String,
      maxlength: 300,
    },

    website: {
      type: String,
      trim: true,
    },

    followersCount: {
      type: Number,
      default: 0,
    },

    followingCount: {
      type: Number,
      default: 0,
    },
    lastLoginAt: {
  type: Date,
},

lastLoginIP: {
  type: String,
},

lastLoginDevice: {
  type: String,
},

lastLoginLocation: {
  lat: Number,
  lng: Number,
  country: String,
  city: String,
},
    
  },
  { timestamps: true }
);

// Compound index
UserSchema.index({ role: 1, isDeleted: 1 });

// Partial unique index for username
UserSchema.index(
  { username: 1 },
  { unique: true, partialFilterExpression: { username: { $exists: true } } }
);

export const User =
  models.User || model("User", UserSchema);