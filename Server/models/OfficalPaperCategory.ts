export default class OfficalPaperCategory {
    _id: string | undefined;
    name: string;
    description: string;
    slug: string;

    constructor(args: any) {
        this._id = args._id ?? undefined;
        this.name = args.name ?? '';
        this.description = args.description ?? '';
        this.slug = args.slug ?? ''
    }
}