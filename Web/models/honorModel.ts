export default class Honor {
    id: number | undefined;
    title: string;
    shortDes: string;
    des: string;
    avatar: string | null;
    status: number;
    userId: number | null;
    createDate: number;
    type: number;
    userType: number
    constructor(args: any) {
        this.id = args.id ?? undefined;
        this.title = args.title ?? "";
        this.shortDes = args.shortDes ?? "";
        this.des = args.des ?? "";
        this.avatar = args.avatar ?? null;
        this.status = args.status ?? 0;
        this.userId = args.userId ?? null;
        this.createDate = args.createDate ?? 0;
        this.type = args.type ?? 0;// 0 tổ chức - 1 ban tập thể
        this.userType = args.userType ?? 0;// 1 sinh viên, 2 giảng viên, 3 doanh nghiệp
    }
}