import { Schema, model, Model, Document, Types } from "mongoose";
import ClubFeatureDetail from "../../models/ClubFeatureDetail";
import { ClubTableName } from "./Club";
import { ClubFeatureChildTableName } from "./ClubFeatureChild";

export const ClubFeatureDetailTableName = "ClubFeatureDetail";

export interface ClubFeatureDetailDocument extends ClubFeatureDetail, Document {
    _id: any;
}

interface IClubFeatureDetailModel extends Model<ClubFeatureDetailDocument> { }

const ClubFeatureDetailSchema = new Schema<ClubFeatureDetailDocument, IClubFeatureDetailModel>({
    title: String,
    content: String,
    criteria: String,
    shortDes: String,
    avatar: String,
    slug: String,
    featureId: {
        type: Types.ObjectId,
        ref: ClubFeatureChildTableName
    },
    clubId: {
        type: Types.ObjectId,
        ref: ClubTableName
    },
    status: Number,
    createDate: Number,
    lastUpdate: Number,
    docUrl: String,
    fromDate: Number,
    toDate: Number,
    settingStatus: Number,
    registerFromDate: Number,
    registerToDate: Number,
    memNum: Number,
    contentType: Number
}, { versionKey: false });

export const ClubFeatureDetailModel = model(ClubFeatureDetailTableName, ClubFeatureDetailSchema);
