import ClubCategory from "@/models/ClubCategory";
import { RESPONSE_FAILED } from "@/utils/contrants";
import { GET_API, POST_API, responseCreate, responseLoad } from ".";

export type reqBodyCreateClubCategory = ClubCategory & {
    clubNum: 0
}

export const apiGetCategorys = async (reqQuery: {
    type: number,
    parentId: string,
    status: number
}): Promise<responseLoad> => {
    const url = 'club/getClubsCategory';
    const res = await POST_API({ url, reqQuery });
    if (res.status !== 200) return {
        data: [],
        status: RESPONSE_FAILED
    };
    return res.data ?? {};
}
export const apiCreateCategorys = async (reqBody: ClubCategory): Promise<responseCreate> => {
    const url = 'club/updateClubCategory';
    const res = await POST_API({ url, reqBody });
    if (res.status !== 200) return {
        data: {},
        status: RESPONSE_FAILED
    };
    return res.data ?? {};
}
export const apiUpdateCategorys = async (reqBody: ClubCategory): Promise<responseCreate> => {
    const url = 'club/updateClubCategory';
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