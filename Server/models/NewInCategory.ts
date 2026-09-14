import { isObject } from "../utils";
import Category from "./Category";
import New from "./New";

export default class NewInCategory {
  _id?: string;
  newsId: any;
  categoryId: any;
  index: number;
  date: number;
  news?: New;
  category?: Category;

  constructor(args: any) {
    this._id = args._id ?? undefined;
    this.newsId = args.newsId?._id ?? (args.newsId ?? null);
    this.categoryId = args.categoryId?._id ?? (args.categoryId ?? null);
    this.index = args.index;
    this.date = args.date ?? 0;
    if (isObject(args.newsId)) this.news = new New(args.newsId);
    if (isObject(args.categoryId)) this.category = new Category(args.categoryId);

  }
}
