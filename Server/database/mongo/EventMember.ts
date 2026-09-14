import { Schema, model, Model, Document, Types } from "mongoose";
import EventMember from "../../models/EventMember";
import { EventTableName } from "./Event";
import { UserInfoTableName } from "./UserInfo";

export const EventMemberTableName = "EventMember";

export interface EventMemberDocument extends EventMember, Document {
  _id: any;
}

interface IEventMemberModel extends Model<EventMemberDocument> { }

const EventMemberSchema = new Schema<EventMemberDocument, IEventMemberModel>(
  {
    userId: {
      type: Types.ObjectId,
      ref: UserInfoTableName
    },
    eventId: {
      type: Types.ObjectId,
      ref: EventTableName
    },
    status: Number,
    joinDate: Number,
    student: Schema.Types.Mixed,
    note: String,
  },
  { versionKey: false }
);

export const EventMemberModel = model(EventMemberTableName, EventMemberSchema);
