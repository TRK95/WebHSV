import { Schema, model, Model, Document, Types } from "mongoose";
import Club from "../../models/Club";
import { ClubCategoryTableName } from "./ClubCategory";

export const ClubTableName = "Club";

export interface ClubDocument extends Club, Document {
  _id: any;
}

interface IClubModel extends Model<ClubDocument> { }

const ClubSchema = new Schema<ClubDocument, IClubModel>({
  name: String,
  shortDes: String,
  des: String,
  slug: String,
  categoryId: {
    type: Types.ObjectId,
    ref: ClubCategoryTableName
  },
  status: Number,
  ownerId: String,
  createDate: Number,
  type: Number,
  categoryName: String,
  memNum: Number,
  avatar: String,
  showMem: Number,
  settingStatus: Number,
  president: Schema.Types.Mixed,
  presidentId: String,
  contactInfo: String
}, { versionKey: false });

export const ClubModel = model(ClubTableName, ClubSchema);
