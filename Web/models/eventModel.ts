import { STATUS_PUBLIC, STATUS_NO_REGISTER } from "../utils/constraint";

export default class EventModel {
    _id: string | undefined;
    title: string;
    content: string;
    criteria: string;
    avatar: string | null;
    slug: string;
    hostBy: string | null;
    status: number;
    settingStatus: number;
    createDate: number;
    fromDate: number;
    toDate: number;
    registerFromDate: number;
    registerToDate: number;
    memNum: number;
    constructor(args: any) {
        this._id = args._id ?? undefined;
        this.title = args.title ?? '';
        this.content = args.content ?? '';
        this.criteria = args.criteria ?? '';
        this.avatar = args.avatar ?? null;
        this.slug = args.slug ?? '';
        this.hostBy = args.hostBy ?? null;
        this.status = args.status ?? STATUS_PUBLIC;
        this.settingStatus = args.settingStatus ?? STATUS_NO_REGISTER;
        this.createDate = args.createDate ?? 0;
        this.fromDate = args.formDate ?? 0;
        this.toDate = args.toDate ?? 0;
        this.registerFromDate = args.registerFromDate ?? 0;
        this.registerToDate = args.registerToDate ?? 0;
        this.memNum = args.memNum ?? 0;
    }
}