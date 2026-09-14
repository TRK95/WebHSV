import { Schema, model, Model, Document, Types } from "mongoose";
import ClubFeatureChild from "../../models/ClubFeatureChild";
import { ClubTableName } from "./Club";

export const ClubFeatureChildTableName = "ClubFeatureChild";

export interface ClubFeatureChildDocument extends ClubFeatureChild, Document {
    _id: any;
}

interface IClubFeatureChildModel extends Model<ClubFeatureChildDocument> { }

const ClubFeatureChildSchema = new Schema<ClubFeatureChildDocument, IClubFeatureChildModel>({
    title: String,
    shortDes: String,
    slug: String,
    parentId: {
        type: Types.ObjectId,
        ref: ClubTableName
    },
    status: Number,
    createDate: Number,
    lastUpdate: Number,
    type: Number,
}, { versionKey: false });

export const ClubFeatureChildModel = model(ClubFeatureChildTableName, ClubFeatureChildSchema);
