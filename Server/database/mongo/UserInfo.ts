import { Schema, model, Model, Document } from "mongoose";
import UserInfo from "../../models/UserInfo";

export const UserInfoTableName = "UserInfo";

export interface UserInfoDocument extends UserInfo, Document {
    _id: any;
}

interface IUserInfoModel extends Model<UserInfoDocument> { }

const UserInfoSchema = new Schema<UserInfoDocument, IUserInfoModel>({
    userId: String,
    password: String,
    status: Number,
    fullName: String,
    birthdate: Number,
    className: String,
    schoolName: String,
    year: Number,
    phoneNumber: String,
    email: String,
    createDate: {
        type: Number,
        default: Date.now()
    },
    lastCheckin: {
        type: Number,
        default: Date.now()
    },
    studentYear: String,
    avatarUrl: String,
    homeProvince: String

}, { versionKey: false });

export const UserInfoModel = model(UserInfoTableName, UserInfoSchema);
