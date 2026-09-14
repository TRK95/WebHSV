import { STATUS_PUBLIC, STATUS_NO_REGISTER } from "../utils/constraint";
import Student from "./studentModel";

export default class Club {
    _id: string | undefined;
    name: string;
    des: string;
    shortDes: string;
    slug: string;
    categoryId: number | null;
    status: number;
    settingStatus: number;
    ownerId: string | null;
    createDate: number;
    type: number;
    categoryName: string;
    memNum: number;
    avatar: string;
    president: Student;
    presidentId: string | null;
    showMem: number; // 0 la khong show, 1 la show
    contactInfo: string;
    constructor(args: any) {
        this._id = args._id ?? undefined;
        this.name = args.name ?? '';
        this.des = args.des ?? '';
        this.shortDes = args.shortDesc ?? '';
        this.slug = args.slug ?? '';
        this.categoryId = args.categoryId ?? null;
        this.status = args.status ?? STATUS_PUBLIC;
        this.settingStatus = args.settingStatus ?? STATUS_NO_REGISTER;
        this.ownerId = args.ownerId ?? null;
        this.createDate = args.createDate ?? 0;
        this.type = args.type; // 0 tổ chức - 1 ban liên lạc
        this.categoryName = args.categoryName ?? '';
        this.avatar = args.avatar ?? '';
        this.memNum = args.memNum ?? 0;
        this.president = args.president ?? null;
        this.showMem = args.showMem ?? 1;
        this.contactInfo = args.contactInfo ?? 1;
    }
}