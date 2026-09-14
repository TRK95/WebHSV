import { SharedModel } from "./base";

export class Course extends SharedModel {
  _id: string;
  name: string;
  slug: string;
  categoryId: string;

  constructor(args: Partial<Course> & Record<string, any> = {}) {
    super(args);
    this._id = args._id ?? args.id ?? "";
    this.name = args.name ?? "";
    this.slug = args.slug ?? "";
    this.categoryId = args.categoryId ?? "";
  }
}

export default Course;
