import { STATUS_WAITING } from "../utils/constraint";
import Student from "./studentModel";

export default class EventMember {
    id: number | undefined;
    userId: string | null;
    eventId: number | null;
    status: number;
    joinDate: number;
    student: Student;
    note: string | null;
    constructor(args: any) {
        this.id = args.id ?? undefined;
        this.userId = args.userId ?? null;
        this.eventId = args.eventId ?? null;
        this.status = args.status ?? STATUS_WAITING;
        this.joinDate = args.joinDate ?? 0;
        this.student = args.student ?? {};
        this.note = args.note ?? null;
    }
}