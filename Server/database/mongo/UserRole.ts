import { Schema, model, Model, Document, Types } from "mongoose";
import UserRole from "../../models/UserRole";
import { UserTableName } from "./User";

export const UserRoleTableName = "UserRole";

export interface UserRoleDocument extends UserRole, Document {
    _id: any;
}

interface IUserRoleModel extends Model<UserRoleDocument> { }

const UserRoleSchema = new Schema<UserRoleDocument, IUserRoleModel>({
    userId: {
        type: Types.ObjectId,
        ref: UserTableName,
    },
    studentId: String,
    role: String,
}, { versionKey: false });

export const UserRoleModel = model(UserRoleTableName, UserRoleSchema);
