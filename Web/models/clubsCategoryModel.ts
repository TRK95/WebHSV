import { STATUS_PUBLIC } from "../utils/constraint";

export default class ClubCategory {
    _id: string | undefined;
    name: string;
    des: string;
    slug: string;
    status: number;
    createDate: number;
    clubNum: number;
    avatar: string;
    constructor(args: any) {
        this._id = args._id ?? undefined;
        this.name = args.name ?? '';
        this.des = args.des ?? '';
        this.slug = args.slug ?? '';
        this.status = args.status ?? STATUS_PUBLIC;
        this.createDate = args.createDate ?? 0;
        this.clubNum = args.clubNum ?? 0;
        this.avatar = args.avatar ?? ''
    }
}