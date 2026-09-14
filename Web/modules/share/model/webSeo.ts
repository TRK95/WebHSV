import { SharedModel } from "./base";

export default class WebSeo extends SharedModel {
  seoTitle: string;
  descriptionSeo: string;
  keyword: string;
  slug: string;
  metaRobot: number;
  jsonLd: any;
  imageSharing: string;
  imageSharingMeta: { alt?: string };

  constructor(args: Partial<WebSeo> & Record<string, any> = {}) {
    super(args);
    this.seoTitle = args.seoTitle ?? "";
    this.descriptionSeo = args.descriptionSeo ?? "";
    this.keyword = args.keyword ?? "";
    this.slug = args.slug ?? "";
    this.metaRobot = args.metaRobot ?? 1;
    this.jsonLd = args.jsonLd ?? null;
    this.imageSharing = args.imageSharing ?? "";
    this.imageSharingMeta = args.imageSharingMeta ?? {};
  }
}
