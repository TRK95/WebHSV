import fetch from "isomorphic-fetch";
import qs from "query-string";
import { response_status } from "../modules/share/api_services/http_status";

const isSameSite = ['true', 'false'].includes(process.env.NEXT_PUBLIC_SAMESITE || 'false') ? !!JSON.parse(process.env.NEXT_PUBLIC_SAMESITE || 'false') : false;
const apiHost = isSameSite ? '' : (process.env.NEXT_PUBLIC_ENDPOINT || 'http://localhost:3001');

export enum ResponseStatusCode {
  success = 200,
  notFound = 404,
  internal = 500
}

export const getEndpoint = (endpoint: string, local?: boolean) => {
  return local ? `${process.env.NEXT_PUBLIC_LOCAL_ENDPOINT || ''}${endpoint}` : endpoint;
}

export class FetchError extends Error {
  constructor(msg?: string) {
    super();
    this.name = "FetchError",
      this.message = msg ?? "";
  }
}

const defaultHeaders = {
  "Content-Type": "application/json",
  Accept: "application/json",
  "Cache-Control": "no-cache"
}

export type RequestData = {
  endpoint: string;
  method?: "GET" | "POST",
  body?: any;
  customHeaders?: any;
  bodyType?: "json" | "multipart",
  responseType?: "json" | "buffer" | "text"
  withCredentials?: boolean;
};

const request = async (args: RequestData) => {
  const {
    endpoint,
    method = "GET",
    body,
    customHeaders = {},
    withCredentials = true,
    bodyType = "json",
    responseType = "json"
  } = args;
  let _endpoint = endpoint;
  if (!endpoint.startsWith("http")) {
    _endpoint = `${apiHost}${endpoint}`;
  }
  const headers = {
    ...defaultHeaders,
    ...customHeaders,
  }
  if (method === "POST" && bodyType === "multipart") headers["Content-Type"] = "multipart/form-data";
  try {
    const response = await fetch(_endpoint, {
      method,
      headers,
      body: body ? (bodyType === "multipart" ? body : JSON.stringify(body)) : null,
      credentials: withCredentials ? "include" : "omit",
      cache: "no-store"
    });
    const data = responseType === "buffer" ?
      await response.arrayBuffer()
      : (responseType === "text" ? await response.text() : await response.json());
    return {
      error: response.status !== ResponseStatusCode.success,
      data
    }
  } catch (error) {
    throw new FetchError(error?.message ?? 'Unexpected Error');
  }
}

export const get = (args: Omit<RequestData, "method" | "body"> & { params?: any }) => {
  const { endpoint, params, ...rest } = args;
  let _endpoint = endpoint;
  if (params && !(params.constructor === Object && !Object.keys(params).length)) {
    _endpoint += `?${qs.stringify(params, { encode: true })}`;
  }
  return request({ endpoint: _endpoint, ...rest });
}

export const getWithStatus = async (args: Omit<RequestData, "method" | "body"> & { params?: any }) => {
  const { data, error } = await get(args);
  return {
    error: error || data?.status !== response_status.success,
    data: data?.data
  }
}

export const post = (args: Omit<RequestData, "method"> & { params?: any }) => {
  const { endpoint, params, ...rest } = args;
  let _endpoint = endpoint;
  if (params && !(params.constructor === Object && !Object.keys(params).length)) {
    _endpoint += `?${qs.stringify(params, { encode: true })}`;
  }
  return request({ method: "POST", endpoint: _endpoint, ...rest });
}

export const postWithStatus = async (args: Omit<RequestData, "method">) => {
  const { data, error } = await post(args);
  return {
    error: error || data?.status !== response_status.success,
    data: data?.data
  }
}
