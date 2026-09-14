export default class OfficalPaper {
    _id: string | undefined;
    name: string;
    type: number;
    categoryId: string;
    description: string;
    content: string;
    slug: string

    constructor(args: any) {
        this._id = args._id ?? undefined;
        this.name = args.name ?? '';
        this.type = args.type ?? 0;
        this.categoryId = args.categoryId ?? '';
        this.description = args.description ?? '';
        this.content = args.content ?? '';
        this.slug = args.slug ?? '';
    }
}