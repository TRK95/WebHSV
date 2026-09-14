import NewsModel from "./newsModel";

export default class NewsInCategory {
    _id: string | undefined;
    newsId: number;
    categoryId: number;
    index: number;
    date: number;
    news: NewsModel | null;
    constructor(args: any) {
        this._id = args._id ?? undefined;
        this.newsId = args.newsId ?? null;
        this.categoryId = args.categoryId ?? null;
        this.index = args.index;
        this.date = args.date ?? 0;
        this.news = args.news ?? null
    }
}