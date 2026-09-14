import NewsCategory from "../../models/newsCategoryModel";
import NewsModel from "../../models/newsModel";
import { GET_API, POST_API } from ".";
import NewsInCategory from "../../models/newsIncategory";
export const apiGetNewsByDate = async ({ reqQuery, reqBody }: { reqQuery?: any, reqBody?: any }): Promise<{ data: NewsModel[] & { inCategories?: Array<NewsInCategory> }, status: number, total: number }> => {
    const url = 'news/getNewsByDate';
    const res = await POST_API({ url, reqQuery, reqBody });
    return res.data ?? [];
}

export const apiGetNewsBySlug = async ({ reqQuery }: { reqQuery?: any, reqBody?: any }): Promise<{ data: NewsModel, status: number }> => {
    const url = 'news/getNewsBySlug';
    const res = await GET_API({ url, reqQuery });
    return res.data ?? {}
}

export const apiGetNewsCategories = async ({ reqQuery }: { reqQuery?: any }): Promise<{ data: Array<NewsCategory>, status: number }> => {
    const url = 'news/getNewsCategory';
    const res = await POST_API({ url, reqQuery });
    return res.data ?? []
}

export const apiAddOrRemoveNewsCategory = async ({ reqQuery, reqBody }: { reqQuery?: any, reqBody?: any }): Promise<{ data: string, status: number }> => {
    const url = 'news/addOrRemoveNewFromCategory';
    const res = await POST_API({ url, reqQuery, reqBody });
    return res.data ?? {};
}

export const apiGetNewsInCategory = async ({ reqQuery }: { reqQuery?: any }): Promise<{ data: Array<NewsInCategory & { news: NewsModel }>, status: number, total: number }> => {
    const url = 'news/getNewsInCategory';
    const res = await POST_API({ url, reqQuery });
    return res.data ?? []
}

export const apiGetNewsByType = async ({ reqQuery }: { reqQuery?: any }): Promise<{ data: Array<NewsModel>, status: number, total: number }> => {
    const url = 'news/getNewsByType';
    const res = await POST_API({ url, reqQuery });
    return res.data ?? []
}

export const apiGetcategoryOfNews = async (reqQuery: {
    newId: string
}): Promise<{ data: NewsCategory[], status: number }> => {
    const url = 'news/getCategoriesOfNew';
    const res = await POST_API({ url, reqQuery });
    return res.data ?? {};
}

export const apiUpdateNews = async ({ reqQuery, reqBody }: { reqQuery?: any, reqBody?: any }): Promise<{ data: NewsModel, status: number }> => {
    const url = 'news/updateNews';
    const res = await POST_API({ url, reqQuery, reqBody });
    return res.data ?? {};
}
