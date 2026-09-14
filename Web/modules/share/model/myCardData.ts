import { SharedModel } from "./base";

export default class MyCardData extends SharedModel {
  boxCard: Record<string, number>;
  cardBookmarks: string[];

  constructor(args: Partial<MyCardData> & Record<string, any> = {}) {
    super(args);
    this.boxCard = args.boxCard ?? {};
    this.cardBookmarks = args.cardBookmarks ?? [];
  }
}
