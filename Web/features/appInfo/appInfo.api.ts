import AppSetting from "../../modules/share/model/appSetting";
import WebSeo from "../../modules/share/model/webSeo";
import { get, getEndpoint } from "../../utils/fetcher";

export const apiGetAppSettingDetails = async (args: { appName: string; fields?: Array<keyof AppSetting>; local?: boolean }): Promise<AppSetting> => {
  const { appName, fields, local = true } = args;
  const params: any = { appName };
  if (typeof fields !== "undefined" && Array.isArray(fields)) {
    params.fields = fields.join(",");
  }
  const { data, error } = await get({ endpoint: getEndpoint("/api/app-setting-info", local), params });
  return error ? null : data;
}

export const apiGetSEOInfo = async (appId: string, slug?: string, local = true): Promise<WebSeo> => {
  const { data, error } = await get({ endpoint: getEndpoint("/api/web-app-seo-info", local), params: { appId, slug } });
  return error ? null : data;
}