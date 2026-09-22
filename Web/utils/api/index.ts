import { STATUS_PUBLIC } from "../constraint";

const PUBLIC_READ_ENDPOINTS = new Set([
  "news/getNewsByDate",
  "news/getNewsBySlug",
  "news/getNewsCategory",
  "news/getNewsInCategory",
  "news/getNewsByType",
  "news/getCategoriesOfNew",
  "club/getClubsByDate",
  "club/getClubsCategory",
  "club/getClubsByParentId",
  "club/getClubBySlug",
  "club/getClubById",
  "club/getClubCategoryBySlug",
  "events/getEventsByDate",
  "events/getEventsBySlug",
  "clubFeatureChild/getClubFeatureChild",
  "clubFeatureChild/getClubFeatureChildByClubSlug",
  "clubFeatureChild/getClubFeatureChildBySlug",
  "clubFeatureDetail/getClubFeatureDetailByClubId",
  "clubFeatureDetail/getClubFeatureDetailByFeatureId",
  "clubFeatureDetail/getClubFeatureDetailBySlug",
]);

const PUBLIC_CACHE_TTL = 60 * 1000;
const responseCache = new Map<string, { expiresAt: number, value: any }>();
const pendingRequests = new Map<string, Promise<any>>();

const stableSerialize = (value: any): string => {
  if (!value || typeof value !== "object") return JSON.stringify(value ?? null);
  if (Array.isArray(value)) return `[${value.map(stableSerialize).join(",")}]`;
  return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stableSerialize(value[key])}`).join(",")}}`;
};

const withPublicCache = async <T,>(url: string, key: string, request: () => Promise<T>): Promise<T> => {
  if (typeof window === "undefined" || !PUBLIC_READ_ENDPOINTS.has(url)) {
    return request();
  }

  const cached = responseCache.get(key);
  if (cached && cached.expiresAt > Date.now()) return cached.value as T;

  const pending = pendingRequests.get(key);
  if (pending) return pending as Promise<T>;

  const requestPromise = request()
    .then(value => {
      if ((value as any)?.status === 200) {
        responseCache.set(key, { expiresAt: Date.now() + PUBLIC_CACHE_TTL, value });
      }
      return value;
    })
    .finally(() => pendingRequests.delete(key));

  pendingRequests.set(key, requestPromise);
  return requestPromise;
};

export type responseLoad = {
  data: any[],
  status: number,
  total?: number
}

export type responseCreate = {
  data: any,
  status: number
}

export const domain = [
  {
    id: 1,
    name: "Cổng thông tin"
  },
  {
    id: 2,
    name: "Cựu sinh viên"
  }
]

export const GET_API = async ({ url, reqQuery }: { url: string, reqQuery?: any }) => {
  const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
  const TOKEN = process.env.NEXT_PUBLIC_TOKEN;
  let dataUrl = new URL(`${API_ENDPOINT}/api/${url}`)
  if (url === 'change-password') {
    dataUrl = new URL(`${API_ENDPOINT}/${url}`)
  }
  const dataQuery = {
    status: STATUS_PUBLIC,
    ...reqQuery,
    accessKey: TOKEN,
  }
  Object.keys(dataQuery).forEach(key => dataUrl.searchParams.append(key, dataQuery[key]))
  const cacheKey = `GET:${dataUrl.href}`;
  return withPublicCache(url, cacheKey, async () => {
    try {
      const res: Response = await fetch(dataUrl.href, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        } as HeadersInit,
        cache: "no-store",
      });
      const data = await res.json();
      const status = res.status;
      if (status != 200) {
        console.error(url, "status", status, " error ", data);
      }
      return { status, data };
    } catch (error) {
      console.error(url, "network error", error);
      return { status: 500, data: null };
    }
  });
};

export const POST_API = async ({ url, reqQuery, reqBody }: { url: string, reqQuery?: any, reqBody?: any }) => {
  const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
  const TOKEN = process.env.NEXT_PUBLIC_TOKEN;
  const dataUrl = new URL(`${API_ENDPOINT}/api/${url}`)
  const dataQuery = {
    status: STATUS_PUBLIC,
    ...reqQuery,
    accessKey: TOKEN,
  }
  Object.keys(dataQuery).forEach(key => dataUrl.searchParams.append(key, dataQuery[key]))
  // const res: Response = await fetch(decodeURIComponent(dataUrl.href), {
  const cacheKey = `POST:${dataUrl.href}:${stableSerialize(reqBody)}`;
  return withPublicCache(url, cacheKey, async () => {
    try {
      const res: Response = await fetch(dataUrl.href, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        } as HeadersInit,
        body: JSON.stringify(reqBody),
        cache: "no-store",
      });
      const data = await res.json();
      const status = res.status;
      if (status != 200) {
        console.error(url, "status", status, " error ", data);
      }
      return { status, data };
    } catch (error) {
      console.error(url, "network error", error);
      return { status: 500, data: null };
    }
  });
};
