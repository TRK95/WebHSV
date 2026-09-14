import { SharedModel } from "./base";

export default class AppSetting extends SharedModel {
  appName: string;
  siteAddress: string;
  title: string;
  ua?: string;
  ga?: string;
  dmca?: string;
  googleAdsClient?: string;
  googleSiteVerification?: string;

  constructor(args: Partial<AppSetting> & Record<string, any> = {}) {
    super(args);
    this.appName = args.appName ?? "";
    this.siteAddress = args.siteAddress ?? "";
    this.title = args.title ?? "";
  }
}
