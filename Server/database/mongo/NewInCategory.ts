import { Schema, model, Types, Model, Document } from "mongoose";
import NewInCategory from "../../models/NewInCategory";
import { NewTableName } from "./New";
import { CategoryTableName } from "./Category";

export const NewInCategoryTableName = "NewInCategory";

export interface NewInCategoryDocument extends NewInCategory, Document {
  _id: any;
}

interface INewInCategoryModel extends Model<NewInCategoryDocument> { }

const NewInCategorySchema = new Schema<
  NewInCategoryDocument,
  INewInCategoryModel
>(
  {
    newsId: {
      type: Types.ObjectId,
      ref: NewTableName
    },
    categoryId: {
      type: Types.ObjectId,
      ref: CategoryTableName
    },
    index: Number,
    date: Number,
  },
  { versionKey: false }
);

export const NewInCategoryModel = model(
  NewInCategoryTableName,
  NewInCategorySchema
);
