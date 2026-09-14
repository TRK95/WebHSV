import { STATUS_REGISTER_JOIN } from "../utils/contrants";

export default class Event {
  _id: string | undefined;
  title: string;
  content: string;
  criteria: string;
  avatar: string | null;
  slug: string;
  clubId: string;
  status: number;
  createDate: number;
  fromDate: number;
  toDate: number;
  settingStatus: number; // 3 trạng thái
  registerFromDate: number;
  registerToDate: number;
  memNum: number;
  constructor(args: any) {
    this._id = args._id ?? undefined;
    this.title = args.title ?? "";
    this.content = args.content ?? "";
    this.criteria = args.criteria ?? "";
    this.avatar = args.avatar ?? null;
    this.slug = args.slug ?? "";
    this.clubId = args.clubId ?? null;
    this.status = args.status;
    this.createDate = args.createDate ?? 0;
    this.fromDate = args.fromDate ?? 0;
    this.toDate = args.toDate ?? 0;
    this.settingStatus = args.settingStatus ?? STATUS_REGISTER_JOIN;
    this.registerFromDate = args.registerFromDate ?? 0;
    this.registerToDate = args.registerToDate ?? 0;
    this.memNum = args.memNum ?? 0;
  }
}
