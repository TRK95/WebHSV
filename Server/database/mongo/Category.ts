import { Schema, model, Types, Model, Document } from "mongoose";
import Category from "../../models/Category";

export const CategoryTableName = "Category";

export interface CategoryDocument extends Category, Document {
  _id: any;
}

interface ICategoryModel extends Model<CategoryDocument> { }

const CategorySchema = new Schema<CategoryDocument, ICategoryModel>(
  {
    title: String,
    des: String,
    slug: String,
    createDate: {
      type: Number,
      default: Date.now()
    },
    status: Number,
    parentId: {
      type: Types.ObjectId,
      ref: CategoryTableName,
    },
    type: Number,
    index: Number,
  },
  { versionKey: false }
);

export const CategoryModel = model(CategoryTableName, CategorySchema);
