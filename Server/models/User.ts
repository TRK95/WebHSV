export default class User {
  _id: string | undefined;
  studentId: number;
  fullName: string;
  birthdate: number;
  majorName: string;
  studentYear: string;
  year: number;
  phoneNumber: string;
  email: string;
  status: number | null;
  createDate: number;
  notes: string;
  departmentId: number | null;
  programId: number | null;
  constructor(args: any) {
    this._id = args._id ?? undefined;
    this.studentId = args.studentId ?? 0;
    this.fullName = args.fullName ?? "";
    this.birthdate = args.birthdate ?? 0;
    this.majorName = args.majorName ?? "";
    this.studentYear = args.studentYear ?? "";
    this.year = args.year ?? 0;
    this.status = args.status ?? null;
    this.createDate = args.createDate ?? 0;
    this.notes = args.notes ?? "";
    this.email = args.email ?? "";
    this.phoneNumber = args.phoneNumber ?? "";
    this.departmentId = args.departmentId ?? null;
    this.programId = args.programId ?? null;
  }
}
