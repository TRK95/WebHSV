export type Sv5tCriterion = {
  key: string;
  title: string;
  type?: "REQUIRED" | "OPTIONAL";
  minVerifiedActivities: number;
};

export type Sv5tCriterionGroup = {
  key: string;
  title: string;
  requiredOptionalCount: number;
  criteria: Sv5tCriterion[];
};

export const DEFAULT_SV5T_CRITERIA: Sv5tCriterionGroup[] = [
  { key: "DAO_DUC", title: "Đạo đức tốt", requiredOptionalCount: 0, criteria: [{ key: "DAO_DUC", title: "Đạo đức tốt", type: "REQUIRED", minVerifiedActivities: 1 }] },
  { key: "HOC_TAP", title: "Học tập tốt", requiredOptionalCount: 0, criteria: [{ key: "HOC_TAP", title: "Học tập tốt", type: "REQUIRED", minVerifiedActivities: 1 }] },
  { key: "THE_LUC", title: "Thể lực tốt", requiredOptionalCount: 0, criteria: [{ key: "THE_LUC", title: "Thể lực tốt", type: "REQUIRED", minVerifiedActivities: 1 }] },
  { key: "TINH_NGUYEN", title: "Tình nguyện tốt", requiredOptionalCount: 0, criteria: [{ key: "TINH_NGUYEN", title: "Tình nguyện tốt", type: "REQUIRED", minVerifiedActivities: 1 }] },
  { key: "HOI_NHAP", title: "Hội nhập tốt", requiredOptionalCount: 0, criteria: [{ key: "HOI_NHAP", title: "Hội nhập tốt", type: "REQUIRED", minVerifiedActivities: 1 }] },
];

export const SV5T_CLAIM_REJECTED = -1;
export const SV5T_CLAIM_PENDING = 0;
export const SV5T_CLAIM_APPROVED = 1;

export const SV5T_RESULT_NOT_QUALIFIED = "NOT_QUALIFIED";
export const SV5T_RESULT_PENDING = "PENDING";
export const SV5T_RESULT_PASSED = "PASSED";

export class Sv5tCampaign {
  _id?: string;
  title: string;
  academicYear: string;
  status: number;
  submitFrom: number;
  submitTo: number;
  criteria: Sv5tCriterionGroup[];
  createDate: number;
  constructor(args: any = {}) {
    this._id = args._id;
    this.title = args.title ?? "";
    this.academicYear = args.academicYear ?? "";
    this.status = args.status ?? 1;
    this.submitFrom = args.submitFrom ?? 0;
    this.submitTo = args.submitTo ?? 0;
    this.criteria = args.criteria?.length ? args.criteria : DEFAULT_SV5T_CRITERIA;
    this.createDate = args.createDate ?? Date.now();
  }
}

export class Sv5tActivity {
  _id?: string;
  campaignId: string;
  title: string;
  criterionKey: string;
  organizer: string;
  activityDate: number;
  verificationMode: "AUTO_LIST" | "MANUAL";
  status: number;
  participantCount: number;
  createDate: number;
  constructor(args: any = {}) {
    this._id = args._id;
    this.campaignId = args.campaignId ?? "";
    this.title = args.title ?? "";
    this.criterionKey = args.criterionKey ?? "";
    this.organizer = args.organizer ?? "";
    this.activityDate = args.activityDate ?? 0;
    this.verificationMode = args.verificationMode ?? "MANUAL";
    this.status = args.status ?? 1;
    this.participantCount = args.participantCount ?? 0;
    this.createDate = args.createDate ?? Date.now();
  }
}

export class Sv5tParticipant {
  _id?: string;
  campaignId: string;
  activityId: string;
  studentId: string;
  fullName: string;
  createDate: number;
  constructor(args: any = {}) {
    this._id = args._id;
    this.campaignId = args.campaignId ?? "";
    this.activityId = args.activityId ?? "";
    this.studentId = args.studentId ?? "";
    this.fullName = args.fullName ?? "";
    this.createDate = args.createDate ?? Date.now();
  }
}

export class Sv5tClaim {
  _id?: string;
  campaignId: string;
  activityId?: string | null;
  studentId: string;
  fullName: string;
  title: string;
  criterionKey: string;
  organizer: string;
  activityDate: number;
  evidenceObject: string;
  status: number;
  source: "MANUAL_ACTIVITY" | "SUGGESTED";
  adminNote: string;
  createDate: number;
  reviewedAt: number;
  constructor(args: any = {}) {
    this._id = args._id;
    this.campaignId = args.campaignId ?? "";
    this.activityId = args.activityId ?? null;
    this.studentId = args.studentId ?? "";
    this.fullName = args.fullName ?? "";
    this.title = args.title ?? "";
    this.criterionKey = args.criterionKey ?? "";
    this.organizer = args.organizer ?? "";
    this.activityDate = args.activityDate ?? 0;
    this.evidenceObject = args.evidenceObject ?? "";
    this.status = args.status ?? SV5T_CLAIM_PENDING;
    this.source = args.source ?? "SUGGESTED";
    this.adminNote = args.adminNote ?? "";
    this.createDate = args.createDate ?? Date.now();
    this.reviewedAt = args.reviewedAt ?? 0;
  }
}

export class Sv5tApplication {
  _id?: string;
  campaignId: string;
  studentId: string;
  fullName: string;
  submittedAt: number;
  resultStatus: string;
  lastCalculatedAt: number;
  constructor(args: any = {}) {
    this._id = args._id;
    this.campaignId = args.campaignId ?? "";
    this.studentId = args.studentId ?? "";
    this.fullName = args.fullName ?? "";
    this.submittedAt = args.submittedAt ?? Date.now();
    this.resultStatus = args.resultStatus ?? SV5T_RESULT_NOT_QUALIFIED;
    this.lastCalculatedAt = args.lastCalculatedAt ?? Date.now();
  }
}
