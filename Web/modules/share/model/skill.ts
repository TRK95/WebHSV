import { SharedModel } from "./base";

export default class Skill extends SharedModel {
  _id: string;
  id: string;
  name: string;
  type: number;
  value: number;

  constructor(args: Partial<Skill> & Record<string, any> = {}) {
    super(args);
    this._id = args._id ?? args.id ?? "";
    this.id = args.id ?? this._id;
    this.name = args.name ?? "";
    this.type = args.type ?? args.value ?? 0;
    this.value = args.value ?? this.type;
  }
}
