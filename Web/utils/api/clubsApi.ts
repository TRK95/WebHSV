import { GET_API, POST_API, responseCreate, responseLoad } from ".";
import ClubCategory from "../../models/clubsCategoryModel";
import Club from "../../models/clubsModel";
import { REQUEST_FAILED, RESPONSE_FAILED } from "../constraint";

export type MyClub = {
    id?: number,
    userId?: string,
    clubId?: number,
    status?: number,
    joinDate?: number,
    role?: number,
    club?: Club
}

export type reqQueryClubs = {
    limit: number,
    offset: number,
    type: number,
    status: number
}

export type reqBodyCreateClubs = Club & {
    memNum: 0
}

export const apiGetClubsByDate = async ({ reqQuery }: { reqQuery?: any }): Promise<{ data: Array<Club>, status: number, total: number }> => {
    const url = 'club/getClubsByDate';
    const res = await POST_API({ url, reqQuery });
    if (res.status !== 200) return {
        data: [],
        status: REQUEST_FAILED,
        total: 0
    };
    return res.data ?? []
}

export const apiGetClubCategories = async ({ reqQuery, reqBody }: {
    reqQuery?: any,
    reqBody?: any
}): Promise<{ data: ClubCategory[], status: number }> => {
    const url = 'club/getClubsCategory';
    const res = await POST_API({
        url, reqQuery: reqQuery
    });
    if (res.status !== 200) return {
        data: [],
        status: REQUEST_FAILED
    };
    return res.data ?? [];
}

export const apiGetClubsByCategoryId = async ({ reqQuery }: { reqQuery?: { categoryId: string } }): Promise<{ data: Array<Club>, status: number }> => {
    const url = 'club/getClubsByParentId';
    const res = await POST_API({ url, reqQuery });
    if (res.status !== 200) return {
        data: [],
        status: REQUEST_FAILED
    };
    return res.data ?? [];
}

export const apiGetClubBySlug = async ({ reqQuery }: { reqQuery?: { slug: string } }): Promise<{ data: Club, status: number }> => {
    const url = 'club/getClubBySlug';
    const res = await GET_API({ url, reqQuery });
    if (res.status !== 200) return {
        data: null,
        status: REQUEST_FAILED
    };
    return res.data ?? {};
}

export const apiGetClubById = async ({ reqQuery }: { reqQuery?: any }): Promise<{ data: Club, status: number }> => {
    const url = 'club/getClubById';
    const res = await GET_API({ url, reqQuery });
    if (res.status !== 200) return {
        data: null,
        status: REQUEST_FAILED
    };
    return res.data ?? {};
}

export const apiGetMyClubs = async ({ reqQuery }: { reqQuery?: any }): Promise<{ data: Array<MyClub>, status: number }> => {
    const url = "club/getMyClubs";
    const res = await POST_API({ url, reqQuery })
    if (res.status !== 200) return {
        data: null,
        status: REQUEST_FAILED
    }
    return res.data ?? []
}

export const getClubsByTypeApi = async ({ reqQuery }: { reqQuery?: reqQueryClubs }): Promise<responseLoad> => {
    const url = 'club/getClubsByDate';
    const res = await POST_API({ url, reqQuery });
    if (res.status !== 200) return {
        data: [],
        status: RESPONSE_FAILED
    };
    return res.data ?? {};
}

export const apiGetClubsByCategory = async (reqQuery: {
    categoryId: number,
    status: number
}): Promise<responseLoad> => {
    const url = 'club/getClubsByParentId';
    const res = await POST_API({ url, reqQuery });
    if (res.status !== 200) return {
        data: [],
        status: RESPONSE_FAILED
    };
    return res.data ?? {};
}

export const apiCreateClubApi = async ({ reqBody }: { reqBody: reqBodyCreateClubs }): Promise<responseCreate> => {
    const url = 'club/updateClub';
    const res = await POST_API({ url, reqBody });
    if (res.status !== 200) return {
        data: [],
        status: RESPONSE_FAILED
    };
    return res.data ?? {};
}

export const apiUpdateClubApi = async ({ reqBody }: { reqBody: Club }): Promise<responseCreate> => {
    const url = 'club/updateClub';
    const res = await POST_API({ url, reqBody });
    if (res.status !== 200) return {
        data: [],
        status: RESPONSE_FAILED
    };
    return res.data ?? {};
}

export const apiGetClubCategoryBySlug = async (reqQuery: { slug: string }): Promise<responseCreate> => {
    const url = "club/getClubCategoryBySlug";
    const res = await GET_API({ url, reqQuery })
    if (res.status !== 200) return {
        data: {},
        status: RESPONSE_FAILED
    }
    return res.data ?? {};
}
