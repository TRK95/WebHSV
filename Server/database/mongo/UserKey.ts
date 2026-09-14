import { Schema, model, Model, Document, Types } from "mongoose";
import UserKey from "../../models/UserKey";
import { UserTableName } from "./User";

export const UserKeyTableName = "UserKey";

export interface UserKeyDocument extends UserKey, Document {
    _id: any;
}

interface IUserKeyModel extends Model<UserKeyDocument> { }

const UserKeySchema = new Schema<UserKeyDocument, IUserKeyModel>({
    userId: {
        type: Types.ObjectId,
        ref: UserTableName,
    },
    privateKey: String,
    publicKey: String
}, { versionKey: false });

export const UserKeyModel = model(UserKeyTableName, UserKeySchema);
