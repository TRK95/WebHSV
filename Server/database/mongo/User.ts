import { Schema, model, Model, Document } from "mongoose";
import User from "../../models/User";

export const UserTableName = "User";

export interface UserDocument extends User, Document {
  _id: any;
}

interface IUserModel extends Model<UserDocument> { }

const UserSchema = new Schema<UserDocument, IUserModel>({
  studentId: Number,
  fullName: String,
  birthdate: Number,
  majorName: String,
  studentYear: String,
  year: Number,
  phoneNumber: String,
  email: String,
  status: Number,
  createDate: Number,
  notes: String,
  departmentId: Number,
  programId: Number,
}, { versionKey: false });

export const UserModel = model(UserTableName, UserSchema);
