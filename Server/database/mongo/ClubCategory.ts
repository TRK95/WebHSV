import { Schema, model, Model, Document } from "mongoose";
import ClubCategory from "../../models/ClubCategory";

export const ClubCategoryTableName = "ClubCategory";

export interface ClubCategoryDocument extends ClubCategory, Document {
  _id: any;
}

interface IClubCategoryModel extends Model<ClubCategoryDocument> { }

const ClubCategorySchema = new Schema<ClubCategoryDocument, IClubCategoryModel>(
  {
    name: String,
    des: String,
    slug: String,
    status: Number,
    createDate: Number,
    clubNum: Number,
    type: Number,
    avatar: String,
    parentId: String,
  },
  { versionKey: false }
);

export const ClubCategoryModel = model(
  ClubCategoryTableName,
  ClubCategorySchema
);
