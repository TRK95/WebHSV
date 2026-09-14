import { SEOProps } from "../components/SEO";
import { LayoutProps } from "../features/common/Layout";
import AppSetting from "../modules/share/model/appSetting";
import WebSeo from "../modules/share/model/webSeo";

export const getWebSEOProps = (webSeo: WebSeo = {} as WebSeo): SEOProps => ({
  title: webSeo?.seoTitle,
  description: webSeo?.descriptionSeo,
  keywords: webSeo?.keyword,
  slug: webSeo?.slug,
  robots: webSeo?.metaRobot,
  jsonLd: webSeo?.jsonLd,
  imageSharing: webSeo?.imageSharing ?? '',
  imageSharingAlt: webSeo?.imageSharingMeta?.alt ?? ''
});

export const getWebAppProps = (appInfo: AppSetting = {} as AppSetting): Pick<LayoutProps, "ua" | "ga" | "dmca" | "googleAdsClient" | "siteAddress" | "googleSiteVerification" | "title"> => ({
  ua: appInfo?.ua,
  ga: appInfo?.ga,
  dmca: appInfo?.dmca,
  googleAdsClient: appInfo?.googleAdsClient,
  googleSiteVerification: appInfo?.googleSiteVerification,
  siteAddress: appInfo?.siteAddress
})
