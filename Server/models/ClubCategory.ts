import { STATUS_PUBLIC } from "../utils/contrants";

export default class ClubCategory {
  _id: string | undefined;
  index: number;
  name: string;
  des: string;
  slug: string;
  status: number;
  createDate: number;
  clubNum: number;
  type: number;
  avatar: string;
  parentId: string;
  constructor(args: any) {
    this._id = args._id ?? undefined;
    this.index = args.index ?? 0;
    this.name = args.name ?? "";
    this.des = args.des ?? "";
    this.slug = args.slug ?? "";
    this.status = args.status ?? STATUS_PUBLIC;
    this.createDate = args.createDate ?? 0;
    this.type = args.type; // 0 câu lạc bộ - 1 ban liên lạc
    this.clubNum = args.clubNum ?? 0;
    this.avatar = args.avatar ?? "";
    this.parentId = args.parentId ?? "";
  }
}
