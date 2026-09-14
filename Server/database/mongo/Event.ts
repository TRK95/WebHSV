import { Schema, model, Model, Document } from "mongoose";
import Event from "../../models/Event";

export const EventTableName = "Event";

export interface EventDocument extends Event, Document {
  _id: any;
}

interface IEventModel extends Model<EventDocument> { }

const EventSchema = new Schema<EventDocument, IEventModel>(
  {
    title: String,
    content: String,
    criteria: String,
    avatar: String,
    slug: String,
    hostBy: String,
    status: Number,
    createDate: Number,
    fromDate: Number,
    toDate: Number,
    settingStatus: Number,
    registerFromDate: Number,
    registerToDate: Number,
    memNum: Number,
  },
  { versionKey: false }
);

export const EventModel = model(EventTableName, EventSchema);
