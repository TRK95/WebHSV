import axios, { AxiosRequestConfig } from "axios";

export const axiosPost = async (url: string, reqBody: any, config?: AxiosRequestConfig) => {
  const res = axios.post(url, reqBody, config);
  return res;
}
export const axiosGet = async (url: string, config?: AxiosRequestConfig) => {
  const res = axios.get(url, config);
  return res;
}