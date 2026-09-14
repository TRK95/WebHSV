import { SharedModel } from "./base";

export default class MockTest extends SharedModel {
  _id: string;
  name: string;

  constructor(args: Partial<MockTest> & Record<string, any> = {}) {
    super(args);
    this._id = args._id ?? args.id ?? "";
    this.name = args.name ?? "";
  }
}
