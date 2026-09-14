import { STATUS_PUBLIC, STATUS_REGISTER_JOIN } from "../utils/contrants";

export default class Club {
  _id: string | undefined;
  name: string;
  des: string;
  shortDes: string;
  slug: string;
  categoryId: number | null;
  status: number;
  ownerId: string | null;
  createDate: number;
  type: number;
  categoryName: string;
  memNum: number;
  avatar: string;
  showMem: number; // 0 : khong show , 1: show
  settingStatus: number; // 1,2,3
  president: any | null;
  presidentId: string | null;
  contactInfo: string;
  constructor(args: any) {
    this._id = args._id ?? undefined;
    this.name = args.name ?? "";
    this.des = args.des ?? "";
    this.slug = args.slug ?? "";
    this.categoryId = args.categoryId ?? null;
    this.status = args.status ?? STATUS_PUBLIC;
    this.ownerId = args.ownerId ?? null;
    this.createDate = args.createDate ?? 0;
    this.type = args.type;
    this.categoryName = args.categoryName ?? "";
    this.memNum = args.memNum ?? 0;
    this.avatar = args.avatar ?? "";
    this.showMem = args.showMem ?? 0;
    this.settingStatus = args.settingStatus ?? STATUS_REGISTER_JOIN;
    this.shortDes = args.shortDes ?? "";
    this.president = args.president ?? null;
    this.presidentId = args.presidentId ?? null;
    this.contactInfo = args.contactInfo ?? "";
  }
}
