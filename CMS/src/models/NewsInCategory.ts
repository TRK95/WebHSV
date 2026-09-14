import { isObject } from "@/utils/utils";
import NewsModel from "./NewsModel";
import NewsCategory from "./NewsCategory";

export default class NewsInCategory {
    _id: string | undefined;
    newsId: string;
    categoryId: string;
    index: number;
    date: number;
    news?: NewsModel | null;
    category?: NewsCategory | null;
    constructor(args: any) {
        this._id = args._id ?? undefined;
        this.newsId = args.newsId ?? null;
        this.categoryId = args.categoryId ?? null;
        this.index = args.index;
        this.date = args.date ?? 0;
        if (isObject(args.newsId))
            this.news = new NewsModel(args.newsId);
        if (isObject(args.categoryId))
            this.category = new NewsCategory(args.categoryId);
    }
}