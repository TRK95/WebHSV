import { STATUS_PUBLIC } from "@/utils/contrants";

export default class NewsCategory {
    _id: string | undefined;
    title: string;
    des: string;
    slug: string;
    createDate: number;
    status: number;
    parentId: string;
    type: number;
    index: number;
    constructor(args: any) {
        this._id = args._id ?? undefined;
        this.title = args.title ?? '';
        this.des = args.des ?? '';
        this.slug = args.slug ?? '';
        this.createDate = args.createDate ?? 0;
        this.status = args.status ?? STATUS_PUBLIC;
        this.parentId = args.parentId ?? -1;
        this.type = args.type;
        this.index = args.index ?? 0;
    }
}