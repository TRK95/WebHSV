// import { Incategories } from "@/components/NewsPageView";
import NewsCategory from "@/models/NewsCategory";
import NewsInCategory from "@/models/NewsInCategory";
import NewsModel from "@/models/NewsModel";
import { RESPONSE_FAILED } from "@/utils/contrants";
import { GET_API, POST_API } from "../api"

export const getNewsByDate = async ({ reqQuery, reqBody }: { reqQuery?: any, reqBody?: any }): Promise<{ data: NewsModel[] & { inCategories?: Array<NewsInCategory> }, status: number, total: number }> => {
    const url = 'news/getNewsByDate';
    const res = await POST_API({ url, reqQuery, reqBody });
    return res.data ?? [];
}

export const apiUpdateNews = async ({ reqQuery, reqBody }: { reqQuery?: any, reqBody?: any }): Promise<{ data: NewsModel, status: number }> => {
    const url = 'news/updateNews';
    const res = await POST_API({ url, reqQuery, reqBody });
    return res.data ?? {};
}
// export const apiGetNewsCategory = async (reqQuery: { parentId: number, status: number, type?: number }): Promise<{ data: NewsCategory[], status: number }> => {
export const apiGetNewsCategory = async (reqQuery: { parentId: string, status: number, type?: number }): Promise<{ data: NewsCategory[], status: number }> => {
    const url = 'news/getNewsCategory';
    const res = await POST_API({ url, reqQuery });
    return res.data ?? [];
}

export const apiUpdateNewsCategory = async ({ reqQuery, reqBody }: { reqQuery?: any, reqBody?: any }): Promise<{ data: NewsCategory, status: number }> => {
    const url = 'news/updateNewsCategory';
    const res = await POST_API({ url, reqQuery, reqBody });
    return res.data ?? {};
}

export const apiAddOrRemoveCategory = async ({ reqQuery, reqBody }: { reqQuery?: any, reqBody?: any }): Promise<{ data: string, status: number }> => {
    const url = 'news/addOrRemoveNewFromCategory';
    const res = await POST_API({ url, reqQuery, reqBody });
    return res.data ?? {};
}

export const apiGetNewsBySlug = async (reqQuery: { slug: string }): Promise<{ data: NewsCategory | null, status: number }> => {
    const url = 'news/getNewsBySlug'
    const res = await GET_API({
        url,
        reqQuery
    })
    if (res.status !== 200) return {
        data: null,
        status: RESPONSE_FAILED
    };    
    return res.data ?? {}
}

export const apiGetNewsCategoryBySlug = async (reqQuery: { slug: string }): Promise<{ data: any, status: number }> => {
    const url = "news/getCategoryNewsBySlug"
    const res = await GET_API({ url, reqQuery })
    if (res.status !== 200) return {
        data: {},
        status: RESPONSE_FAILED
    };
    return res.data ?? {}
}

export const apiGetNewsInCategory = async (reqQuery: {
    // categoryId: number,
    categoryId: string,
    offset: number,
    limit: number,
    status: number
}): Promise<{ data: any, status: number, total: number }> => {
    const url = 'news/getNewsInCategory';
    const res = await POST_API({ url, reqQuery });
    return res.data ?? {};
}

export const apiGetcategoryOfNews = async (reqQuery: {
    // newId : number
    newId : string
}): Promise<{ data: NewsCategory[], status: number }> => {
    const url = 'news/getCategoriesOfNew';
    const res = await POST_API({ url, reqQuery });
    return res.data ?? {};
}
