import { SharedModel } from "./base";

export default class CourseCategory extends SharedModel {
  _id: string;
  name: string;
  slug: string;

  constructor(args: Partial<CourseCategory> & Record<string, any> = {}) {
    super(args);
    this._id = args._id ?? args.id ?? "";
    this.name = args.name ?? "";
    this.slug = args.slug ?? "";
  }
}
