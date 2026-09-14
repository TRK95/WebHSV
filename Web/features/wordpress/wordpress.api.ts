import { get } from "../../utils/fetcher";
import { post_per_page, wpHomeURL } from "./wordpress.config";
import { pickPost, WPCategory, WPPost } from "./wordpress.model";

export const apiGetWPCategoryBySlug = async (args: { slug: string }): Promise<WPCategory> => {
  const { slug } = args;
  const { data, error } = await get({ endpoint: `${wpHomeURL}/wp-json/wp/v2/categories`, params: { slug, per_page: 1 } });
  return error ? null : (data[0] || null);
}

export const apiGetWPCategoryById = async (args: { id: number; }): Promise<WPCategory> => {
  const { id } = args;
  const { data, error } = await get({ endpoint: `${wpHomeURL}/wp-json/wp/v2/categories/${id}` });
  return error ? null : data;
}

export const apiGetWPSEOHeaderString = async (args: { url: string; }): Promise<string> => {
  const { url } = args;
  const { data, error } = await get({ endpoint: `${wpHomeURL}/wp-json/rankmath/v1/getHead`, params: { url } });
  return error ? '' : data.head;
}

export const apiGetWPPostBySlug = async (args: { slug: string; categoryId?: number; }): Promise<WPPost> => {
  const { slug, categoryId } = args;
  const { data, error } = await get({ endpoint: `${wpHomeURL}/wp-json/wp/v2/posts`, params: { slug, per_page: 1, categories: categoryId, _embed: true } });
  return error ? null : Array.isArray(data) && !!data.length ? (pickPost({ post: data[0], withContent: true }) || null) : null;
}

export type GetWPPostsArgs = {
  categoryId?: number;
  page: number;
  per_page?: number;
  offset: number;
}

export const apiGetWPPosts = async (args: GetWPPostsArgs): Promise<Array<WPPost>> => {
  const {
    categoryId,
    per_page = post_per_page,
    ...payload
  } = args;
  const params: any = { ...payload, per_page, categories: categoryId, _embed: true };
  if (typeof categoryId !== "undefined") Object.assign(params, { categories: categoryId });
  const { data, error } = await get({ endpoint: `${wpHomeURL}/wp-json/wp/v2/posts`, params });
  return ((error ? [] : (Array.isArray(data) ? data : [])) as Array<WPPost>).map((post) => pickPost({ post }));
}