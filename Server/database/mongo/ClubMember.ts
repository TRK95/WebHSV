import { Schema, model, Model, Document, Types } from "mongoose";
import ClubMember from "../../models/ClubMember";
import { UserInfoTableName } from "./UserInfo";
import { ClubTableName } from "./Club";

export const ClubMemberTableName = "ClubMember";

export interface ClubMemberDocument extends ClubMember, Document {
  _id: any;
}

interface IClubMemberModel extends Model<ClubMemberDocument> { }

const ClubMemberSchema = new Schema<ClubMemberDocument, IClubMemberModel>({
  userId: {
    type: Types.ObjectId,
    ref: UserInfoTableName
  },
  clubId: {
    type: Types.ObjectId,
    ref: ClubTableName
  },
  status: Number,
  joinDate: Number,
  role: Number,
  student: Schema.Types.Mixed,
  note: String,
}, { versionKey: false });

export const ClubMemberModel = model(ClubMemberTableName, ClubMemberSchema);
