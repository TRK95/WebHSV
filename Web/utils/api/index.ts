import { STATUS_PUBLIC } from "../constraint";

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
  const res: Response = await fetch(dataUrl.href, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
    } as HeadersInit,
    cache: "no-store",
  });
  const data = await res.json();
  const status = res.status;
  if (status != 200) {
    console.error(url, "status", status, " error ", data);
  }
  return { status, data };
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
  const res: Response = await fetch(dataUrl.href, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
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
};
