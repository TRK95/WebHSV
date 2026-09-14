import { STATUS_PUBLIC } from "@/utils/contrants";

export default class NewsModel {
    _id: string | undefined;
    title: string;
    content: string;
    shortDes: string;
    avatar: string;
    slug: string;
    writer: string | null;
    status: number;
    createDate: number;
    lastUpdate: number;
    docUrl: string;
    contentType: number;
    constructor(args: any) {
        // this.id = args.id ?? undefined;
        this._id = args._id ?? undefined;
        this.title = args.title ?? '';
        this.content = args.content ?? '';
        this.shortDes = args.shortDes ?? '';
        this.avatar = args.avatar ?? '';
        this.slug = args.slug ?? '';
        this.writer = args.writer ?? null;
        this.status = args.status ?? STATUS_PUBLIC;
        this.createDate = args.createDate ?? 0;
        this.lastUpdate = args.lastUpdate ?? 0;
        this.docUrl = args.docUrl ?? '';
        this.contentType = args.contentType ?? 0 // 0 la tin tuc, 1 la van ban, 4 la gioi thieu
    }
}