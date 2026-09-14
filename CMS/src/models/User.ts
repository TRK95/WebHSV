
export default class User {
    id: number | undefined;
    _id: string | undefined;
    fullName: string;
    studentId: string;
    birthday: number;
    schoolOrFaculty: string;
    phoneNumber: number;
    session: string;
    class: string;
    CPA: number;
    email: string;
    majorName: string;
    studentYear: string;
    year: number;
    status: number | null;
    createDate: number;
    notes: string;
    departmentId: number | null;
    programId: number | null;

    constructor(args: any) {
        this._id = args._id ?? undefined;
        this.studentId = args.studentId ?? 0;
        this.fullName = args.fullName ?? '';
        this.birthday = args.birthday ?? 0;
        this.phoneNumber = args.phoneNumber ?? 0;
        this.schoolOrFaculty = args.schoolOrFaculty ?? '';
        this.session = args.session ?? '';
        this.class = args.class ?? '';
        this.CPA = args.CPA ?? 0;
        this.email = args.email ?? '';
        this.id = args.id ?? undefined;
        this.majorName = args.majorName ?? '';
        this.studentYear = args.studentYear ?? '';
        this.year = args.year ?? 0;
        this.status = args.status ?? null;
        this.createDate = args.createDate ?? 0;
        this.notes = args.notes ?? '';
        this.phoneNumber = args.phoneNumber ?? '';
        this.departmentId = args.departmentId ?? null;
        this.programId = args.programId ?? null;
    }
}