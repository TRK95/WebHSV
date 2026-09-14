import { STATUS_WAITING } from "../utils/contrants";

export default class FeatureDetailMember {
    _id: string | undefined;
    userId: string | null;
    featureDetailId: string | null;
    status: number;
    joinDate: number;
    student: any;
    note: string | null;
    constructor(args: any) {
        this._id = args._id ?? undefined;
        this.userId = args.userId ?? null;
        this.featureDetailId = args.featureDetailId ?? null;
        this.status = args.status ?? STATUS_WAITING;
        this.joinDate = args.joinDate ?? 0;
        this.student = args.student ?? {};
        this.note = args.note ?? null;
    }
}
