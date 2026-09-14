import { post } from "../fetcher";

const apiHost = process.env.NEXT_PUBLIC_ENDPOINT || 'http://localhost:3001';

export const postTimeOnSite = async (reqBody) => {
  const res = navigator.sendBeacon(`${apiHost}/api/time-on-site`, JSON.stringify(reqBody));
  // const { data, error } = await post({ endpoint: "/api/time-on-site", body: reqBody });
  return res;
}