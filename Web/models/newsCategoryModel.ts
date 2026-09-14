import { STATUS_PUBLIC } from "../utils/constraint";

export default class NewsCategory {
    _id: number | undefined;
    title: string;
    des: string;
    slug: string;
    createDate: number;
    status: number;
    parentId: number;
    type: number;
    constructor(args: any) {
        this._id = args._id ?? undefined;
        this.title = args.title ?? '';
        this.des = args.des ?? '';
        this.slug = args.slug ?? '';
        this.createDate = args.createDate ?? 0;
        this.status = args.status ?? STATUS_PUBLIC;
        this.parentId = args.parentId ?? -1;
        this.type = args.type; //0 chua co con, 1 co con la category, 2 co con la new, 3 co con la document, 4 co con la introduce
    }
}