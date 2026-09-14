
export default class Student {
    id: number;
    studentId: string;
    userName: string;
    account: string;
    name: string;
    fullName: string;
    password: string;
    email: string;
    personalEmail: string;
    workEmail: string;
    phoneNumber: string;
    workPhoneNumber: string;
    homeAddress: string;
    sessionId: string;
    birthdate: number;
    position: string;
    companyName: string;
    year: string;
    contactAddress: string;
    className: string;
    schoolName: string;
    mssv: string
    majorName: string;
    notes: any;
    departmentId: any;
    programId: any;
    avatarUrl: string;
    graduationYear: string
    constructor(args: any) {
        this.id = args.id ?? 0;
        this.studentId = args.studentId ?? '';
        this.account = args.account ?? '';
        this.name = args.name ?? '';
        this.fullName = args.fullName ?? '';
        this.password = args.password ?? '';
        this.email = args.email ?? '';
        this.personalEmail = args.personalEmail ?? ''
        this.workEmail = args.workEmail ?? ''
        this.phoneNumber = args.phoneNumber ?? '';
        this.workPhoneNumber = args.workPhoneNumber ?? '';
        this.homeAddress = args.address ?? '';
        this.sessionId = args.sessionId ?? '';
        this.birthdate = args.birthdate ?? 0;
        this.position = args.position ?? '';
        this.companyName = args.companyName ?? '';
        this.year = args.year ?? '';
        this.contactAddress = args.contactAddress ?? ''
        this.className = args.className ?? ''
        this.schoolName = args.schoolName ?? ''
        this.mssv = args.mssv ?? ''
        this.majorName = args.majorName ?? ''
        this.notes = args.notes ?? ''
        this.departmentId = args.departmentId ?? ''
        this.programId = args.programId ?? ''
        this.avatarUrl = args.avatarUrl ?? ''
        this.userName = args.userName ?? ''
        this.graduationYear = args.graduationYear ?? ''
    }
}