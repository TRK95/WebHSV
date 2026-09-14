import { store } from '../redux/store';

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
  },
  {
    id: 3,
    name: "Công đoàn"
  }
]

export const GET_API = async ({ url, reqQuery }: { url: string, reqQuery?: any }) => {
  const API_ENDPOINT = store.getState().initialReducer.apiPort ?? process.env.API_ENDPOINT;
  const TOKEN = store.getState().initialReducer.token ?? process.env.TOKEN;
  const dataUrl = new URL(`${API_ENDPOINT}/api/${url}`)
  const dataQuery = {
    ...reqQuery,
    accessKey: TOKEN,
  }
  Object.keys(dataQuery).forEach(key => dataUrl.searchParams.append(key, dataQuery[key]))
  const res: Response = await fetch(dataUrl.href, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    } as HeadersInit,
  });
  const data = await res.json();
  const status = res.status;
  if (status != 200) {
    console.error(url, "status", status, " error ", data);
  }
  return { status, data };
};

export const POST_API = async ({ url, reqQuery, reqBody, headers }: { url: string, reqQuery?: any, reqBody?: any, headers?: HeadersInit }) => {
  const API_ENDPOINT = store.getState().initialReducer.apiPort ?? process.env.API_ENDPOINT;
  const TOKEN = store.getState().initialReducer.token ?? process.env.TOKEN;
  const dataUrl = new URL(`${API_ENDPOINT}/api/${url}`);
  const dataQuery = {
    ...reqQuery,
    accessKey: TOKEN,
  };
  Object.keys(dataQuery).forEach(key => dataUrl.searchParams.append(key, dataQuery[key]));

  const defaultHeaders: HeadersInit = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  const mergedHeaders = {
    ...defaultHeaders,
    ...headers,
  };

  const res: Response = await fetch(dataUrl.href, {
    method: "POST",
    headers: mergedHeaders,
    body: reqBody instanceof FormData ? reqBody : JSON.stringify(reqBody),
  });

  const data = await res.json();
  const status = res.status;
  if (status != 200) {
    console.error(url, "status", status, " error ", data);
  }
  return { status, data };
};


export const GET_HUST_API = async ({ url, reqQuery }: { url: string, reqQuery?: any }) => {
  const API_ENDPOINT = process.env.API_ENDPOINT_HUST;
  const TOKEN = store.getState().initialReducer.token ?? process.env.TOKEN;
  const SESSION_ID = process.env.SESSION_ID
  const dataUrl = new URL(`${API_ENDPOINT}/api/${url}`)
  const dataQuery = {
    ...reqQuery,
    token: TOKEN,
    accessKey: TOKEN,
    sessionId: SESSION_ID,
    // domainId: domain[2].id
  }
  Object.keys(dataQuery).forEach(key => dataUrl.searchParams.append(key, dataQuery[key]))
  const res: Response = await fetch(dataUrl.href, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    } as HeadersInit,
  });
  const data = await res.json();
  const status = res.status;
  if (status != 200) {
    console.error(url, "status", status, " error ", data);
  }
  return { status, data };
};

export const POST_HUST_API = async ({ url, reqQuery, reqBody }: { url: string, reqQuery?: any, reqBody?: any }) => {
  const API_ENDPOINT = process.env.API_ENDPOINT_HUST;
  const TOKEN = store.getState().initialReducer.token ?? process.env.TOKEN;
  const dataUrl = new URL(`${API_ENDPOINT}/api/${url}`)
  const dataQuery = {
    ...reqQuery,
    accessKey: TOKEN,
    domainId: domain[2].id
  }
  Object.keys(dataQuery).forEach(key => dataUrl.searchParams.append(key, dataQuery[key]))
  const res: Response = await fetch(dataUrl.href, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    } as HeadersInit,
    body: JSON.stringify(reqBody),
  });
  const data = await res.json();
  const status = res.status;
  if (status != 200) {
    console.error(url, "status", status, " error ", data);
  }
  return { status, data };
};

export const PUT_API = async ({ url, reqQuery, reqBody }: { url: string, reqQuery?: any, reqBody?: any }) => {
  const API_ENDPOINT = store.getState().initialReducer.apiPort ?? process.env.API_ENDPOINT;
  const TOKEN = store.getState().initialReducer.token ?? process.env.TOKEN;
  const dataUrl = new URL(`${API_ENDPOINT}/api/${url}`)
  const dataQuery = {
    ...reqQuery,
    accessKey: TOKEN,
  }
  Object.keys(dataQuery).forEach(key => dataUrl.searchParams.append(key, dataQuery[key]))
  const res: Response = await fetch(dataUrl.href, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    } as HeadersInit,
    body: JSON.stringify(reqBody),
  });
  const data = await res.json();
  const status = res.status;
  if (status != 200) {
    console.error(url, "status", status, " error ", data);
  }
  return { status, data };
};

export const GET_API_CMS = async ({ url, reqQuery }: { url: string, reqQuery?: any }) => {
  const API_ENDPOINT_CMS = process.env.API_ENDPOINT_CMS;
  const dataUrl = new URL(`${API_ENDPOINT_CMS}/api/${url}`)
  if (reqQuery != null) Object.keys(reqQuery).forEach(key => dataUrl.searchParams.append(key, reqQuery[key]))
  const res: Response = await fetch(dataUrl.href, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    } as HeadersInit,
    credentials: 'include'
  });
  const data = await res.json();
  const status = res.status;
  return { status, data };
};

export const POST_API_CMS = async ({ url, reqBody }: { url: string, reqBody?: any }) => {
  const API_ENDPOINT_CMS = process.env.API_ENDPOINT_CMS;
  const res: Response = await fetch(`${API_ENDPOINT_CMS}/api/${url}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    } as HeadersInit,
    body: JSON.stringify(reqBody),
    credentials: 'include'
  });
  try {
    const data = await res.json();
    // if (!data.status) {
    //   console.error(url, "status", status, " error ", data);
    // }
    return data;
  } catch (err) {
    const status = res.status;
    return { status, data: null };
  }
}