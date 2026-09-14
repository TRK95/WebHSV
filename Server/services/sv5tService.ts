import { Types } from "mongoose";
import {
  Sv5tActivityModel,
  Sv5tApplicationModel,
  Sv5tCampaignModel,
  Sv5tClaimModel,
  Sv5tParticipantModel,
} from "../database/mongo/Sv5t";
import {
  DEFAULT_SV5T_CRITERIA,
  SV5T_CLAIM_APPROVED,
  SV5T_CLAIM_PENDING,
  SV5T_RESULT_NOT_QUALIFIED,
  SV5T_RESULT_PASSED,
  SV5T_RESULT_PENDING,
  Sv5tCriterion,
} from "../models/Sv5t";

const normalizeStudentId = (value: any) => String(value ?? "").trim().replace(/^['\"]|['\"]$/g, "");

export default class Sv5tService {
  async listCampaigns() {
    const data = await Sv5tCampaignModel.find({}).sort({ createDate: -1 }).exec();
    return { data, status: 0 };
  }

  async upsertCampaign(args: any) {
    const criteria: Sv5tCriterion[] = Array.isArray(args.criteria) && args.criteria.length
      ? args.criteria.map((c: any) => ({
          key: String(c.key),
          title: String(c.title),
          minVerifiedActivities: Math.max(0, Number(c.minVerifiedActivities) || 0),
        }))
      : DEFAULT_SV5T_CRITERIA;

    const payload = {
      title: args.title,
      academicYear: args.academicYear,
      status: args.status ?? 1,
      submitFrom: Number(args.submitFrom) || 0,
      submitTo: Number(args.submitTo) || 0,
      criteria,
    };

    if (args._id) {
      const data = await Sv5tCampaignModel.findByIdAndUpdate(args._id, payload, { new: true });
      const applications = await Sv5tApplicationModel.find({ campaignId: args._id }).select({ studentId: 1 }).exec();
      await Promise.all(applications.map((app: any) => this.refreshApplicationResult(String(args._id), app.studentId)));
      return { data, status: 0 };
    }
    const data = await new Sv5tCampaignModel({ ...payload, createDate: Date.now() }).save();
    return { data, status: 0 };
  }

  async getActiveCampaign() {
    const now = Date.now();
    let data = await Sv5tCampaignModel.findOne({
      status: 1,
      $or: [
        { submitFrom: 0, submitTo: 0 },
        { submitFrom: { $lte: now }, submitTo: { $gte: now } },
        { submitFrom: 0, submitTo: { $gte: now } },
        { submitFrom: { $lte: now }, submitTo: 0 },
      ],
    }).sort({ createDate: -1 });
    return data;
  }

  async createActivity(args: any) {
    const campaign = await Sv5tCampaignModel.findById(args.campaignId);
    if (!campaign) return { data: null, status: -1, message: "Campaign not found" };
    const criterionExists = campaign.criteria?.some((c: any) => c.key === args.criterionKey);
    if (!criterionExists) return { data: null, status: -1, message: "Criterion not found" };

    const data = await new Sv5tActivityModel({
      campaignId: args.campaignId,
      title: args.title,
      criterionKey: args.criterionKey,
      organizer: args.organizer ?? "",
      activityDate: Number(args.activityDate) || 0,
      verificationMode: args.verificationMode === "AUTO_LIST" ? "AUTO_LIST" : "MANUAL",
      status: args.status ?? 1,
      participantCount: 0,
      createDate: Date.now(),
    }).save();
    return { data, status: 0 };
  }

  async updateActivity(args: any) {
    const data = await Sv5tActivityModel.findByIdAndUpdate(args._id, {
      title: args.title,
      criterionKey: args.criterionKey,
      organizer: args.organizer ?? "",
      activityDate: Number(args.activityDate) || 0,
      verificationMode: args.verificationMode,
      status: args.status ?? 1,
    }, { new: true });
    return { data, status: data ? 0 : -1 };
  }

  async listActivities(campaignId: string) {
    const data = await Sv5tActivityModel.find({ campaignId }).sort({ activityDate: -1, createDate: -1 }).exec();
    return { data, status: 0 };
  }

  async importParticipants(activityId: string, rows: Array<{ studentId: string; fullName: string }>) {
    const activity = await Sv5tActivityModel.findById(activityId);
    if (!activity) return { data: null, status: -1, message: "Activity not found" };
    const clean = rows
      .map((r) => ({ studentId: normalizeStudentId(r.studentId), fullName: String(r.fullName ?? "").trim() }))
      .filter((r) => !!r.studentId);

    if (!clean.length) return { data: { imported: 0, total: 0 }, status: -1, message: "No valid student IDs" };

    const oldRows = await Sv5tParticipantModel.find({ activityId }).select({ studentId: 1 }).exec();
    const oldStudentIds = oldRows.map((r: any) => r.studentId);
    await Sv5tParticipantModel.deleteMany({ activityId });
    const docs = clean.map((r) => ({
      campaignId: activity.campaignId,
      activityId: activity._id,
      studentId: r.studentId,
      fullName: r.fullName,
      createDate: Date.now(),
    }));
    let imported = 0;
    if (docs.length) {
      const result = await Sv5tParticipantModel.insertMany(docs, { ordered: false }).catch((err: any) => err.insertedDocs ?? []);
      imported = Array.isArray(result) ? result.length : docs.length;
    }
    const total = await Sv5tParticipantModel.countDocuments({ activityId });
    await Sv5tActivityModel.findByIdAndUpdate(activityId, { participantCount: total, verificationMode: "AUTO_LIST" });
    const affectedStudentIds = Array.from(new Set([...oldStudentIds, ...clean.map((r) => r.studentId)]));
    await Promise.all(affectedStudentIds.map((studentId) => this.refreshApplicationResult(String(activity.campaignId), studentId)));
    return { data: { imported, total }, status: 0 };
  }

  async createClaim(args: any) {
    const studentId = normalizeStudentId(args.studentId);
    if (!studentId || !args.campaignId || !args.evidenceObject) {
      return { data: null, status: -1, message: "Missing required data" };
    }

    let activity: any = null;
    if (args.activityId) {
      activity = await Sv5tActivityModel.findById(args.activityId);
      if (!activity || String(activity.campaignId) !== String(args.campaignId)) {
        return { data: null, status: -1, message: "Invalid activity" };
      }
      const existedParticipant = await Sv5tParticipantModel.findOne({ activityId: activity._id, studentId });
      if (existedParticipant) return { data: null, status: 2, message: "Already verified by participant list" };
    }

    const claimData = {
      campaignId: args.campaignId,
      activityId: activity?._id ?? undefined,
      studentId,
      fullName: args.fullName ?? "",
      title: activity?.title ?? args.title,
      criterionKey: activity?.criterionKey ?? args.criterionKey,
      organizer: activity?.organizer ?? args.organizer ?? "",
      activityDate: activity?.activityDate ?? (Number(args.activityDate) || 0),
      evidenceObject: args.evidenceObject,
      status: SV5T_CLAIM_PENDING,
      source: activity ? "MANUAL_ACTIVITY" : "SUGGESTED",
      adminNote: "",
      createDate: Date.now(),
      reviewedAt: 0,
    };

    if (activity) {
      const existing = await Sv5tClaimModel.findOne({ activityId: activity._id, studentId });
      if (existing) {
        const data = await Sv5tClaimModel.findByIdAndUpdate(existing._id, claimData, { new: true });
        await this.refreshApplicationResult(String(args.campaignId), studentId);
        return { data, status: 0 };
      }
    }

    const data = await new Sv5tClaimModel(claimData).save();
    await this.refreshApplicationResult(String(args.campaignId), studentId);
    return { data, status: 0 };
  }

  async listClaims(args: { campaignId: string; status?: number; limit?: number; offset?: number }) {
    const query: any = { campaignId: args.campaignId };
    if (args.status !== undefined) query.status = args.status;
    const limit = args.limit ?? 50;
    const offset = args.offset ?? 0;
    const [data, total] = await Promise.all([
      Sv5tClaimModel.find(query).sort({ createDate: -1 }).skip(offset).limit(limit).exec(),
      Sv5tClaimModel.countDocuments(query),
    ]);
    return { data, total, status: 0 };
  }

  async reviewClaim(args: { claimId: string; status: number; adminNote?: string; criterionKey?: string }) {
    const claim = await Sv5tClaimModel.findById(args.claimId);
    if (!claim) return { data: null, status: -1 };
    const update: any = {
      status: args.status,
      adminNote: args.adminNote ?? "",
      reviewedAt: Date.now(),
    };
    if (args.criterionKey) update.criterionKey = args.criterionKey;
    const data = await Sv5tClaimModel.findByIdAndUpdate(args.claimId, update, { new: true });
    await this.refreshApplicationResult(String(claim.campaignId), claim.studentId);
    return { data, status: 0 };
  }

  async calculateResult(campaignId: string, studentIdRaw: string) {
    const studentId = normalizeStudentId(studentIdRaw);
    const campaign = await Sv5tCampaignModel.findById(campaignId);
    if (!campaign) return null;

    const [participantRows, claims] = await Promise.all([
      Sv5tParticipantModel.find({ campaignId, studentId }).exec(),
      Sv5tClaimModel.find({ campaignId, studentId, status: { $in: [SV5T_CLAIM_PENDING, SV5T_CLAIM_APPROVED] } }).exec(),
    ]);

    const activityIds = participantRows.map((r: any) => r.activityId);
    const autoActivities = activityIds.length
      ? await Sv5tActivityModel.find({ _id: { $in: activityIds }, status: 1 }).exec()
      : [];

    const verifiedByCriterion: Record<string, any[]> = {};
    const pendingByCriterion: Record<string, any[]> = {};
    for (const criterion of campaign.criteria ?? []) {
      verifiedByCriterion[criterion.key] = [];
      pendingByCriterion[criterion.key] = [];
    }

    autoActivities.forEach((a: any) => {
      if (verifiedByCriterion[a.criterionKey]) verifiedByCriterion[a.criterionKey].push({ source: "AUTO_LIST", activity: a });
    });
    claims.forEach((c: any) => {
      if (c.status === SV5T_CLAIM_APPROVED && verifiedByCriterion[c.criterionKey]) {
        verifiedByCriterion[c.criterionKey].push({ source: c.source, claim: c });
      } else if (c.status === SV5T_CLAIM_PENDING && pendingByCriterion[c.criterionKey]) {
        pendingByCriterion[c.criterionKey].push({ source: c.source, claim: c });
      }
    });

    const criteria = (campaign.criteria ?? []).map((criterion: any) => {
      const verified = verifiedByCriterion[criterion.key]?.length ?? 0;
      const pending = pendingByCriterion[criterion.key]?.length ?? 0;
      const required = Math.max(0, Number(criterion.minVerifiedActivities) || 0);
      const passed = verified >= required;
      const potentiallyPassed = verified + pending >= required;
      return {
        ...(criterion.toObject ? criterion.toObject() : criterion),
        verified,
        pending,
        passed,
        potentiallyPassed,
        verifiedItems: verifiedByCriterion[criterion.key] ?? [],
        pendingItems: pendingByCriterion[criterion.key] ?? [],
      };
    });

    let resultStatus = SV5T_RESULT_NOT_QUALIFIED;
    if (criteria.every((c: any) => c.passed)) resultStatus = SV5T_RESULT_PASSED;
    else if (criteria.every((c: any) => c.passed || c.potentiallyPassed) && criteria.some((c: any) => !c.passed && c.pending > 0)) {
      resultStatus = SV5T_RESULT_PENDING;
    }

    return { campaign, criteria, resultStatus, autoActivities, claims };
  }

  async getStudentDashboard(studentId: string) {
    const campaign = await this.getActiveCampaign();
    if (!campaign) return { data: null, status: 0 };
    const calculated = await this.calculateResult(String(campaign._id), studentId);
    const manualActivities = await Sv5tActivityModel.find({ campaignId: campaign._id, status: 1, verificationMode: "MANUAL" })
      .sort({ activityDate: -1 }).exec();
    const application = await Sv5tApplicationModel.findOne({ campaignId: campaign._id, studentId: normalizeStudentId(studentId) });
    return { data: { ...calculated, manualActivities, application }, status: 0 };
  }

  async submitApplication(campaignId: string, studentId: string, fullName: string) {
    const calculated = await this.calculateResult(campaignId, studentId);
    if (!calculated) return { data: null, status: -1 };
    const data = await Sv5tApplicationModel.findOneAndUpdate(
      { campaignId, studentId: normalizeStudentId(studentId) },
      {
        campaignId,
        studentId: normalizeStudentId(studentId),
        fullName: fullName ?? "",
        submittedAt: Date.now(),
        resultStatus: calculated.resultStatus,
        lastCalculatedAt: Date.now(),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    return { data: { application: data, result: calculated }, status: 0 };
  }

  async refreshApplicationResult(campaignId: string, studentId: string) {
    const application = await Sv5tApplicationModel.findOne({ campaignId, studentId: normalizeStudentId(studentId) });
    if (!application) return;
    const calculated = await this.calculateResult(campaignId, studentId);
    if (!calculated) return;
    await Sv5tApplicationModel.findByIdAndUpdate(application._id, {
      resultStatus: calculated.resultStatus,
      lastCalculatedAt: Date.now(),
    });
  }

  async listApplications(args: { campaignId: string; limit?: number; offset?: number }) {
    const limit = args.limit ?? 50;
    const offset = args.offset ?? 0;
    const [data, total] = await Promise.all([
      Sv5tApplicationModel.find({ campaignId: args.campaignId }).sort({ submittedAt: -1 }).skip(offset).limit(limit).exec(),
      Sv5tApplicationModel.countDocuments({ campaignId: args.campaignId }),
    ]);
    return { data, total, status: 0 };
  }
}
