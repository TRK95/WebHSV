import { Schema, model, Model, Document, Types } from "mongoose";
import FeatureDetailMember from "../../models/FeatureDetailMember";
import { ClubFeatureDetailTableName } from "./ClubFeatureDetail";
import { UserInfoTableName } from "./UserInfo";

export const FeatureDetailMemberTableName = "FeatureDetailMember";

export interface FeatureDetailMemberDocument extends FeatureDetailMember, Document {
    _id: any;
}

interface IFeatureDetailMemberModel extends Model<FeatureDetailMemberDocument> { }

const FeatureDetailMemberSchema = new Schema<FeatureDetailMemberDocument, IFeatureDetailMemberModel>(
    {
        userId: {
            type: Types.ObjectId,
            ref: UserInfoTableName
        },
        featureDetailId: {
            type: Types.ObjectId,
            ref: ClubFeatureDetailTableName
        },
        status: Number,
        joinDate: Number,
        student: Schema.Types.Mixed,
        note: String,
    },
    { versionKey: false }
);

export const FeatureDetailMemberModel = model(FeatureDetailMemberTableName, FeatureDetailMemberSchema);
