import fs from "fs";
import moment from "moment";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import { Builder, parseStringPromise } from "xml2js";
import { apiGetAppSettingDetails } from "../../features/appInfo/appInfo.api";
import { APP_NAME } from "../../utils/checkApp";
import { errorResponse } from "../../utils/nextApiUtils";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const appInfo = await apiGetAppSettingDetails({ appName: APP_NAME, fields: ["siteAddress"], local: true });
  if (!appInfo) return errorResponse(res, 404, "Not Found");
  const sitemapFile = fs.readFileSync(path.join(process.cwd(), "public", "sitemap-0.xml"));
  if (!sitemapFile) return errorResponse(res, 404, "Not Found");
  const sitemap = await parseStringPromise(sitemapFile);
  (sitemap["urlset"] || {})["url"]?.forEach((_url: any) => {
    const lastmod = (_url?.lastmod || [])[0];
    if (_url?.lastmod) _url.lastmod = moment(lastmod).utc().format("YYYY-MM-DDThh:mm:ssZ");
  })
  const sitemapBuilder = new Builder({ headless: true });
  const xmldec = `<?xml version="1.0" encoding="UTF-8"?>`;
  // const newXML = `${xmldec}\n${process.env.NODE_ENV !== "production" ? "" : `<?xml-stylesheet type="text/xsl" href="${appInfo.siteAddress}/main-sitemap.xsl"?>\n`}${sitemapBuilder.buildObject(sitemap)}`;
  const newXML = `${xmldec}\n${sitemapBuilder.buildObject(sitemap)}`;
  res.setHeader("Content-Type", "text/xml").status(200).send(newXML);
}