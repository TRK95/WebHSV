export default class UserKey {
    _id: string | undefined;
    userId: string;
    publicKey: string;
    privateKey: string;

    constructor(args: any) {
        this._id = args._id ?? undefined;
        this.userId = args.userId ?? '';
        this.privateKey = args.privateKey ?? '';
        this.publicKey = args.pulbicKey ?? '';
    }
}