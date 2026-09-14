import { STATUS_PUBLIC } from "../constraint";

export enum TypeUserInfo {
    FREE, STANDARD, PREMIUM
}
export interface UserInfoI {
    userId?: string,
    status?: number,
    fullName?: string,
    birthdate?: number,
    className?: string,
    schoolName?: string,
    year?: number,
    phoneNumber?: string,
    email?: string,
    studentYear?: string,
    avatarUrl?: string,
    homeProvince?: string
}
export default class UserInfo {
    _id: string | undefined;
    userId: string;
    password: string;
    status: number;
    fullName: string;
    birthdate: number;
    className: string;
    schoolName?: string;
    year: number;
    phoneNumber: string;
    email: string;
    studentYear: string;
    avatarUrl: string;
    homeProvince?: string
    createDate: number;
    lastCheckin: number;

    constructor(args: any = {}) {
        this._id = args._id ?? "";
        this.userId = args.userId ?? "";
        this.password = args.password ?? "";
        this.status = args.status ?? STATUS_PUBLIC;
        this.fullName = args.fullName ?? "";
        this.birthdate = args.birthdate ?? 0;
        this.className = args.className ?? "";
        this.schoolName = args.schoolName ?? "";
        this.year = args.year ?? 0;
        this.createDate = args.createDate ?? 0;
        this.email = args.email ?? "";
        this.phoneNumber = args.phoneNumber ?? "";
        this.studentYear = args.studentYear ?? "";
        this.avatarUrl = args.avatarUrl ?? "";
        this.homeProvince = args.homeProvince ?? "";
        this.createDate = args.createDate ?? 0;
        this.lastCheckin = args.lastCheckin ?? 0;
    }
}