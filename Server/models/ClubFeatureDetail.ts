import { STATUS_PUBLIC, STATUS_REGISTER_JOIN } from "../utils/contrants";

export default class ClubFeatureDetail {
    _id: string | undefined;
    title: string;
    content: string;
    criteria: string;
    shortDes: string;
    avatar: string | null;
    slug: string;
    featureId: string | null;
    clubId: string | null;
    status: number;
    createDate: number;
    lastUpdate: number;
    docUrl: string;
    fromDate: number;
    toDate: number;
    settingStatus: number; // 3 trạng thái
    registerFromDate: number;
    registerToDate: number;
    memNum: number;
    contentType: number // 1: new, 2: doc, 3: event

    constructor(args: any) {
        this._id = args._id ?? undefined;
        this.title = args.title ?? "";
        this.content = args.content ?? "";
        this.criteria = args.criteria ?? "";
        this.shortDes = args.shortDes ?? "";
        this.avatar = args.avatar ?? null;
        this.slug = args.slug ?? "";
        this.clubId = args.clubId ?? null;
        this.status = args.status ?? STATUS_PUBLIC;
        this.createDate = args.createDate ?? 0;
        this.lastUpdate = args.lastUpdate ?? 0;
        this.docUrl = args.docUrl ?? "";
        this.fromDate = args.fromDate ?? 0;
        this.toDate = args.toDate ?? 0;
        this.settingStatus = args.settingStatus ?? STATUS_REGISTER_JOIN;
        this.registerFromDate = args.registerFromDate ?? 0;
        this.registerToDate = args.registerToDate ?? 0;
        this.memNum = args.memNum ?? 0;
        this.contentType = args.contentType ?? 1;
    }
}
