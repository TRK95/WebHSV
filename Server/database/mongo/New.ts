import { Schema, model, Model, Document } from "mongoose";
import New from "../../models/New";

export const NewTableName = "New";

export interface NewDocument extends New, Document {
  _id: any;
}

interface INewModel extends Model<NewDocument> { }

export const NewSchema = new Schema<NewDocument, INewModel>(
  {
    title: String,
    content: String,
    shortDes: String,
    avatar: String,
    slug: String,
    ownerId: String,
    contentType: Number,
    status: Number,
    createDate: Number,
    lastUpdate: Number,
    docUrl: String,
  },
  { versionKey: false }
);

export const NewModel = model(NewTableName, NewSchema);
