import mongoose, { Schema, models, model, Document } from "mongoose";
import slugify from "slugify";

// Define the Interface for the Document
interface CategoryDoc extends Document {
  name: string;
  slug: string;
  icon?: string;
}

const CategorySchema = new Schema<CategoryDoc>(
  {
    name: { type: String, required: true, trim: true, unique: true },
    slug: { type: String, lowercase: true, unique: true, index: true },
    icon: { type: String, default: "" },
  },
  { timestamps: true }
);

// Improved Middleware: Using async/await to avoid 'next' typing issues
CategorySchema.pre("save", async function (this: CategoryDoc) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
    });
  }
});

export const Category = models.Category || model<CategoryDoc>("Category", CategorySchema);