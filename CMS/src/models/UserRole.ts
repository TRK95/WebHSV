export default class UserRole {
    _id: string | undefined;
    userId: string;
    studentId: number;
    role: number;

    constructor(args: any) {
        this._id = args._id ?? undefined;
        this.userId = args.userId ?? '';
        this.studentId = args.studentId ?? 0;
        this.role = args.role ?? 0;
    }
}