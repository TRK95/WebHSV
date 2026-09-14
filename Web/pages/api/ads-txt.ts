import { NextApiRequest, NextApiResponse } from "next";
import { apiGetAppSettingDetails } from "../../features/appInfo/appInfo.api";
import { APP_NAME } from "../../utils/checkApp";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const appInfo = await apiGetAppSettingDetails({ appName: APP_NAME, fields: ["adsTxt"], local: true });
  if (!appInfo) {
    res.status(404).send("Not Found");
    res.end();
    return;
  }
  res.send(`${appInfo.adsTxt}`);
}