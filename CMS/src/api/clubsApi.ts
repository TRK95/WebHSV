import Club from "@/models/Club";
import { RESPONSE_FAILED } from "@/utils/contrants";
import { GET_API, POST_API, responseCreate, responseLoad } from "../api";

export type reqQueryClubs = {
    limit: number,
    offset: number,
    type: number,
    status: number
}

export type reqBodyCreateClubs = Club & {
    memNum: 0
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
    categoryId: string,
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

export const apiGetClubsBySlug = async (reqQuery: { slug: string }): Promise<{ data: any | null, status: number }> => {
    const url = 'club/getClubBySlug';
    const res = await GET_API({ url, reqQuery });
    if (res.status !== 200) return {
        data: [],
        status: RESPONSE_FAILED
    };
    return res.data ?? {};
}

export const apiGetClubsByPresidentId = async (reqQuery: { presidentId: string }): Promise<{ data: any | null, status: number }> => {
    const url = 'club/getClubsByPresidentId';
    const res = await GET_API({ url, reqQuery });
    if (res.status !== 200) return {
        data: [],
        status: RESPONSE_FAILED
    };
    return res.data ?? {};
}

export const apiGetClubsByName = async (reqQuery: { name: string }): Promise<{ data: any | null, status: number }> => {
    const url = 'club/getClubByName';
    const res = await GET_API({ url, reqQuery });
    if (res.status !== 200) return {
        data: [],
        status: RESPONSE_FAILED
    };
    return res.data ?? {};
}

export const apiCreateClubApi = async ({ reqBody }: { reqBody: Club }): Promise<responseCreate> => {
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