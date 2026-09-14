import { RESPONSE_FAILED } from "@/utils/contrants";
import { GET_API, POST_API, responseCreate, responseLoad } from ".";
import ClubFeatureChild from "@/models/ClubFeatureChild";
import ClubFeatureDetail from "@/models/ClubFeatureDetail";
import { UserInfoI } from "@/models/UserInfo";

export const apiGetClubFeatureChild = async (reqQuery: { parentId: string | undefined, status: number }): Promise<{ data: any | [], total: number, status: number }> => {
    const url = 'clubFeatureChild/getClubFeatureChild';
    const res = await POST_API({ url, reqQuery });
    if (res.status !== 200) return {
        data: [],
        total: 0,
        status: RESPONSE_FAILED
    };
    return res.data ?? {};
}

export const apiCreateClubFeatureChild = async (reqBody: ClubFeatureChild): Promise<responseCreate> => {
    const url = 'clubFeatureChild/updateClubFeatureChild';
    const res = await POST_API({ url, reqBody });
    if (res.status !== 200) return {
        data: [],
        status: RESPONSE_FAILED
    };
    return res.data ?? {};
}


export const apiUpdateClubFeatureChild = async (reqBody: ClubFeatureChild): Promise<responseCreate> => {
    const url = 'clubFeatureChild/updateClubFeatureChild';
    const res = await POST_API({ url, reqBody });
    if (res.status !== 200) return {
        data: [],
        status: RESPONSE_FAILED
    };
    return res.data ?? {};
}

export const apiGetClubFeatureChildBySlug = async (reqQuery: { parentId: string, slug: string }): Promise<responseCreate> => {
    const url = 'clubFeatureChild/getClubFeatureChildBySlug';
    const res = await GET_API({ url, reqQuery });
    if (res.status !== 200) return {
        data: [],
        status: RESPONSE_FAILED
    };
    return res.data ?? {};
}

export const apiDeleteClubFeatureChild = async (reqQuery: { featureId: string }): Promise<responseCreate> => {
    const url = 'clubFeatureChild/deleteClubFeatureChild';
    const res = await POST_API({ url, reqQuery });
    if (res.status !== 200) return {
        data: [],
        status: RESPONSE_FAILED
    };
    return res.data ?? {};
}


export const apiGetClubFeatureDetailByClubId = async (reqQuery: { limit: number, offset: number, clubId: string, status: number }): Promise<responseLoad> => {
    const url = 'clubFeatureDetail/getClubFeatureDetailByClubId';
    const res = await POST_API({ url, reqQuery });
    if (res.status !== 200) return {
        data: [],
        total: 0,
        status: RESPONSE_FAILED
    };
    return res.data ?? {};
}

export const apiGetClubFeatureDetailByFeatureId = async (reqQuery: { limit: number, offset: number, featureId: string, status: number }): Promise<responseLoad> => {
    const url = 'clubFeatureDetail/getClubFeatureDetailByFeatureId';
    const res = await POST_API({ url, reqQuery });
    if (res.status !== 200) return {
        data: [],
        total: 0,
        status: RESPONSE_FAILED
    };
    return res.data ?? {};
}

export const apiCreateClubFeatureDetail = async (reqBody: ClubFeatureDetail): Promise<responseCreate> => {
    const url = 'clubFeatureDetail/updateClubFeatureDetail';
    const res = await POST_API({ url, reqBody });
    if (res.status !== 200) return {
        data: [],
        status: RESPONSE_FAILED
    };
    return res.data ?? {};
}

export const apiUpdateClubFeatureDetail = async (reqBody: ClubFeatureDetail): Promise<responseCreate> => {
    const url = 'clubFeatureDetail/updateClubFeatureDetail';
    const res = await POST_API({ url, reqBody });
    if (res.status !== 200) return {
        data: [],
        status: RESPONSE_FAILED
    };
    return res.data ?? {};
}

export const apiGetClubFeatureDetailBySlug = async (reqQuery: { slug: string, featureId: string }): Promise<responseCreate> => {
    const url = 'clubFeatureDetail/getClubFeatureDetailBySlug';
    const res = await GET_API({ url, reqQuery });
    if (res.status !== 200) return {
        data: [],
        status: RESPONSE_FAILED
    };
    return res.data ?? {};
}

export const apiJoinClubFeature = async (reqQuery: { featureDetailId: string, note: string, status: number }, reqBody: { user: UserInfoI }): Promise<responseCreate> => {
    const url = 'clubFeatureDetail/joinClubFeature';
    const res = await POST_API({ url, reqQuery, reqBody });
    if (res.status !== 200) return {
        data: [],
        status: RESPONSE_FAILED
    };
    return res.data ?? {};
}

export const apiApproveClubFeature = async (reqQuery: { userId: string, featureDetailId: string, status: number }): Promise<responseCreate> => {
    const url = 'clubFeatureDetail/approveClubFeature';
    const res = await POST_API({ url, reqQuery });
    if (res.status !== 200) return {
        data: [],
        status: RESPONSE_FAILED
    };
    return res.data ?? {};
}

export const apiGetMemberFeatureDetail = async (reqQuery: { featureDetailId: string, offset: number, limit: number }): Promise<{ data: [] | any, total: number, status: number }> => {
    const url = 'clubFeatureDetail/getMemberFeatureDetail';
    const res = await POST_API({ url, reqQuery });
    if (res.status !== 200) return {
        data: [],
        total: 0,
        status: RESPONSE_FAILED
    };
    return res.data ?? {};
}

export const apiGetMemberInfoFeatureDetail = async (reqQuery: { featureDetailId: string, offset: number, limit: number }): Promise<{ data: [] | any, total: number, status: number }> => {
    const url = 'clubFeatureDetail/getMemberInfoFeatureDetail';
    const res = await POST_API({ url, reqQuery });
    if (res.status !== 200) return {
        data: [],
        total: 0,
        status: RESPONSE_FAILED
    };
    return res.data ?? {};
}