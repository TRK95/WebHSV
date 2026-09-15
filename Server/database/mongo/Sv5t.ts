import { Document, model, Model, Schema, Types } from "mongoose";
import { Sv5tActivity, Sv5tApplication, Sv5tCampaign, Sv5tClaim, Sv5tParticipant } from "../../models/Sv5t";

export const Sv5tCampaignTableName = "Sv5tCampaign";
export const Sv5tActivityTableName = "Sv5tActivity";
export const Sv5tParticipantTableName = "Sv5tParticipant";
export const Sv5tClaimTableName = "Sv5tClaim";
export const Sv5tApplicationTableName = "Sv5tApplication";

type Doc<T> = T & Document & { _id: any };
type M<T> = Model<Doc<T>>;

const SubCriterionSchema = new Schema({
  key: String,
  title: String,
  type: String,
  minVerifiedActivities: Number,
}, { _id: false });

const CriterionSchema = new Schema({
  key: String,
  title: String,
  type: String,
  minVerifiedActivities: Number,
  requiredOptionalCount: Number,
  criteria: [SubCriterionSchema],
}, { _id: false });

const CampaignSchema = new Schema<Doc<Sv5tCampaign>, M<Sv5tCampaign>>({
  title: String,
  academicYear: String,
  status: Number,
  submitFrom: Number,
  submitTo: Number,
  criteria: [CriterionSchema],
  createDate: Number,
}, { versionKey: false });

const ActivitySchema = new Schema<Doc<Sv5tActivity>, M<Sv5tActivity>>({
  campaignId: { type: Types.ObjectId, ref: Sv5tCampaignTableName },
  title: String,
  criterionKey: String,
  organizer: String,
  activityDate: Number,
  verificationMode: String,
  status: Number,
  participantCount: Number,
  createDate: Number,
}, { versionKey: false });

const ParticipantSchema = new Schema<Doc<Sv5tParticipant>, M<Sv5tParticipant>>({
  campaignId: { type: Types.ObjectId, ref: Sv5tCampaignTableName },
  activityId: { type: Types.ObjectId, ref: Sv5tActivityTableName },
  studentId: String,
  fullName: String,
  createDate: Number,
}, { versionKey: false });
ParticipantSchema.index({ activityId: 1, studentId: 1 }, { unique: true });
ParticipantSchema.index({ campaignId: 1, studentId: 1 });

const ClaimSchema = new Schema<Doc<Sv5tClaim>, M<Sv5tClaim>>({
  campaignId: { type: Types.ObjectId, ref: Sv5tCampaignTableName },
  activityId: { type: Types.ObjectId, ref: Sv5tActivityTableName, required: false },
  studentId: String,
  fullName: String,
  title: String,
  criterionKey: String,
  organizer: String,
  activityDate: Number,
  evidenceObject: String,
  status: Number,
  source: String,
  adminNote: String,
  createDate: Number,
  reviewedAt: Number,
}, { versionKey: false });
ClaimSchema.index({ campaignId: 1, studentId: 1, status: 1 });
ClaimSchema.index({ activityId: 1, studentId: 1 }, { unique: true, sparse: true });

const ApplicationSchema = new Schema<Doc<Sv5tApplication>, M<Sv5tApplication>>({
  campaignId: { type: Types.ObjectId, ref: Sv5tCampaignTableName },
  studentId: String,
  fullName: String,
  submittedAt: Number,
  resultStatus: String,
  lastCalculatedAt: Number,
}, { versionKey: false });
ApplicationSchema.index({ campaignId: 1, studentId: 1 }, { unique: true });

export const Sv5tCampaignModel = model(Sv5tCampaignTableName, CampaignSchema);
export const Sv5tActivityModel = model(Sv5tActivityTableName, ActivitySchema);
export const Sv5tParticipantModel = model(Sv5tParticipantTableName, ParticipantSchema);
export const Sv5tClaimModel = model(Sv5tClaimTableName, ClaimSchema);
export const Sv5tApplicationModel = model(Sv5tApplicationTableName, ApplicationSchema);
