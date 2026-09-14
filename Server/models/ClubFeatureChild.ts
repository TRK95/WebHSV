import { STATUS_PUBLIC, STATUS_REGISTER_JOIN } from "../utils/contrants";

export default class ClubFeatureChild {
    _id: string | undefined;
    title: string;
    shortDes: string;
    slug: string;
    parentId: string | null;
    status: number;
    createDate: number;
    lastUpdate: number;
    type: number;

    constructor(args: any) {
        this._id = args._id ?? undefined;
        this.title = args.title ?? "";
        this.shortDes = args.shortDes ?? "";
        this.slug = args.slug ?? "";
        this.parentId = args.parentId ?? null;
        this.status = args.status ?? STATUS_PUBLIC;
        this.createDate = args.createDate ?? 0;
        this.lastUpdate = args.lastUpdate ?? 0;
        this.type = args.type ?? 1; // 1: news, 2: introduce, 3: document, 4: event
    }
}
