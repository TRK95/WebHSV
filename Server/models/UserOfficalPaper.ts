export default class UserOfficalPaper {
    _id: string | undefined;
    userId: string;
    paperId: string;
    sender: string;
    receiver: string;
    time: number;
    data: string;
    digitalSignature: string;
    status: number;

    constructor(args: any) {
        this._id = args._id ?? undefined;
        this.userId = args.userId ?? '';
        this.paperId = args.paperId ?? '';
        this.sender = args.sender ?? '';
        this.receiver = args.receiver ?? '';
        this.time = args.time ?? 0;
        this.data = args.data ?? '';
        this.digitalSignature = args.digitalSignature ?? '';
        this.status = args.status ?? 0
    }
}