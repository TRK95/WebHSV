import { STATUS_PUBLIC } from "@/utils/contrants";

export default class News {
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
        this._id = args._id ?? undefined;
        this.title = args.title ?? '';
        this.content = args.content ?? '';
        this.shortDes = args.shortDes ?? '';
        this.avatar = args.avatar ?? '';
        this.slug = args.slug ?? '';
        this.writer = args.ownerId ?? null;
        this.status = args.status ?? STATUS_PUBLIC;
        this.createDate = args.createDate ?? 0;
        this.lastUpdate = args.lastUpdate ?? 0;
        this.docUrl = args.docUrl ?? '';
        this.contentType = args.contentType ?? 0
    }
}