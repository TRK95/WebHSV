import { store } from "@/redux/store";
import { GET_API, POST_API } from ".";

export const SV5T_CRITERIA = [
  { key: "DAO_DUC", title: "Đạo đức tốt" },
  { key: "HOC_TAP", title: "Học tập tốt" },
  { key: "THE_LUC", title: "Thể lực tốt" },
  { key: "TINH_NGUYEN", title: "Tình nguyện tốt" },
  { key: "HOI_NHAP", title: "Hội nhập tốt" },
];

export const apiGetSv5tCampaigns = async () => (await GET_API({ url: "sv5t/campaigns" })).data;
export const apiUpsertSv5tCampaign = async (reqBody: any) => (await POST_API({ url: "sv5t/campaigns/upsert", reqBody })).data;
export const apiGetSv5tActivities = async (campaignId: string) => (await GET_API({ url: "sv5t/activities", reqQuery: { campaignId } })).data;
export const apiCreateSv5tActivity = async (reqBody: any) => (await POST_API({ url: "sv5t/activities", reqBody })).data;
export const apiUpdateSv5tActivity = async (reqBody: any) => (await POST_API({ url: "sv5t/activities/update", reqBody })).data;
export const apiGetSv5tClaims = async (campaignId: string, status?: number) => (await GET_API({ url: "sv5t/claims", reqQuery: { campaignId, ...(status === undefined ? {} : { status }) } })).data;
export const apiReviewSv5tClaim = async (claimId: string, reqBody: any) => (await POST_API({ url: `sv5t/claims/${claimId}/review`, reqBody })).data;
export const apiGetSv5tApplications = async (campaignId: string) => (await GET_API({ url: "sv5t/applications", reqQuery: { campaignId } })).data;

export const apiImportSv5tCsv = async (activityId: string, file: File) => {
  const endpoint = store.getState().initialReducer.apiPort ?? process.env.API_ENDPOINT;
  const token = store.getState().initialReducer.token ?? process.env.TOKEN;
  const url = new URL(`${endpoint}/api/sv5t/activities/${activityId}/import-csv`);
  if (token) url.searchParams.append("accessKey", token);
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(url.href, { method: "POST", body: form });
  return res.json();
};
