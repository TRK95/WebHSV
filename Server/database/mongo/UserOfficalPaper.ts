import { Schema, model, Model, Document, Types } from "mongoose";
import UserOfficalPaper from "../../models/UserOfficalPaper";
import { UserTableName } from "./User";
import { OfficalPaperTableName } from "./OfficalPaper";

export const UserOfficalPaperTableName = "UserOfficalPaper";

export interface UserOfficalPaperDocument extends UserOfficalPaper, Document {
    _id: any;
}

interface IUserOfficalPaperModel extends Model<UserOfficalPaperDocument> { }

const UserOfficalPaperSchema = new Schema<UserOfficalPaperDocument, IUserOfficalPaperModel>({
    userId: {
        type: Types.ObjectId,
        ref: UserTableName,
    },
    paperId: {
        type: Types.ObjectId,
        ref: OfficalPaperTableName,
    },
    sender: String,
    receiver: {
        type: Types.ObjectId,
        ref: UserTableName,
    },
    time: {
        type: Number,
        default: Date.now()
    },
    data: String,
    digitalSignature: String,
    status: Number
}, { versionKey: false });

export const UserOfficalPaperModel = model(UserOfficalPaperTableName, UserOfficalPaperSchema);
