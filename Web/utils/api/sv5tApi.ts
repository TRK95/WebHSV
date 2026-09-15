const apiBase = () => process.env.NEXT_PUBLIC_API_ENDPOINT;

const authHeaders = (token: string, json = true): HeadersInit => ({
  Authorization: `Bearer ${token}`,
  ...(json ? { "Content-Type": "application/json", Accept: "application/json" } : {}),
});

export const SV5T_CRITERIA = [
  { key: "DAO_DUC", title: "Đạo đức tốt", requiredOptionalCount: 0, criteria: [{ key: "DAO_DUC", title: "Đạo đức tốt", type: "REQUIRED", minVerifiedActivities: 1 }] },
  { key: "HOC_TAP", title: "Học tập tốt", requiredOptionalCount: 0, criteria: [{ key: "HOC_TAP", title: "Học tập tốt", type: "REQUIRED", minVerifiedActivities: 1 }] },
  { key: "THE_LUC", title: "Thể lực tốt", requiredOptionalCount: 0, criteria: [{ key: "THE_LUC", title: "Thể lực tốt", type: "REQUIRED", minVerifiedActivities: 1 }] },
  { key: "TINH_NGUYEN", title: "Tình nguyện tốt", requiredOptionalCount: 0, criteria: [{ key: "TINH_NGUYEN", title: "Tình nguyện tốt", type: "REQUIRED", minVerifiedActivities: 1 }] },
  { key: "HOI_NHAP", title: "Hội nhập tốt", requiredOptionalCount: 0, criteria: [{ key: "HOI_NHAP", title: "Hội nhập tốt", type: "REQUIRED", minVerifiedActivities: 1 }] },
];

export const apiGetMySv5tDashboard = async (token: string) => {
  const res = await fetch(`${apiBase()}/api/sv5t/student/dashboard`, { headers: authHeaders(token) });
  return res.json();
};

export const apiUploadSv5tEvidence = async (token: string, file: File) => {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${apiBase()}/api/sv5t/student/evidence`, {
    method: "POST",
    headers: authHeaders(token, false),
    body: form,
  });
  return res.json();
};

export const apiCreateSv5tClaim = async (token: string, data: any) => {
  const res = await fetch(`${apiBase()}/api/sv5t/student/claims`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  return res.json();
};

export const apiSubmitSv5tApplication = async (token: string, campaignId: string) => {
  const res = await fetch(`${apiBase()}/api/sv5t/student/submit`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ campaignId }),
  });
  return res.json();
};
