import { STATUS_PUBLIC } from "../utils/constraint";
import Student from "./studentModel";

export default class ClubMember {
    _id: string | undefined;
    userId: string | null;
    clubId: number | null;
    status: number;
    joinDate: number;
    role: number;
    student: Student;
    constructor(args: any) {
        this._id = args._id ?? undefined;
        this.userId = args.userId ?? null;
        this.clubId = args.clubId ?? null;
        this.status = args.status ?? STATUS_PUBLIC;
        this.joinDate = args.joinDate ?? 0;
        this.role = args.role ?? 0 //0 thành viên,1 chủ tịch
        this.student = args.student ?? {};
    }
}