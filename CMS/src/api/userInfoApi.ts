import UserInfo, { UserInfoI } from "@/models/UserInfo";
import { RESPONSE_FAILED } from "@/utils/contrants";
import { GET_API, POST_API } from "../api"
import ClubMember from "@/models/ClubMember";

export const getUserInfoByDate = async ({ reqQuery, reqBody }: {
    reqQuery?: any, reqBody?: {
        status: number,
        numberDaysAgo: number,
        limit: number,
        offset: number,
        type?: number
    }
}): Promise<{ data: UserInfo[], status: number, total: number }> => {
    const url = 'userInfos/getUserInfoByDate';
    const res = await POST_API({ url, reqQuery, reqBody });
    return res.data ?? [];
}

export const apiCreateUserInfo = async ({ reqQuery, reqBody }: {
    reqQuery?: any, reqBody: UserInfoI
}): Promise<{ data: UserInfo, status: number }> => {
    const url = 'userInfos/createUserInfo';
    const res = await POST_API({ url, reqQuery, reqBody });
    return res.data ?? [];
}

export const apiGetUserInfoById = async ({ reqQuery, reqBody }: {
    reqQuery?: any, reqBody: {
        id: string
    }
}): Promise<{ data: UserInfo, status: number }> => {
    const url = 'userInfos/getUserInfoById';
    const res = await POST_API({ url, reqQuery, reqBody });
    return res.data ?? [];
}

export const apiGetUserInfoByUserId = async ({ reqQuery, reqBody }: {
    reqQuery?: any, reqBody: {
        userId: string
    }
}): Promise<{ data: UserInfo, status: number }> => {
    const url = 'userInfos/getUserInfoByUserId';
    const res = await POST_API({ url, reqQuery, reqBody });
    return res.data ?? [];
}

export const apiGetUserInfoByUserName = async ({ reqQuery, reqBody }: {
    reqQuery?: any, reqBody: {
        name: string
    }
}): Promise<{ data: UserInfo[], status: number }> => {
    const url = 'userInfos/getUserInfoByUserName';
    const res = await POST_API({ url, reqQuery, reqBody });
    return res.data ?? [];
}

export const apiGetUserInfoByEmail = async ({ reqQuery, reqBody }: {
    reqQuery?: any, reqBody: {
        email: string,
        userId?: string
    }
}): Promise<{ data: UserInfo, status: number }> => {
    const url = 'userInfos/getUserInfoByEmail';
    const res = await POST_API({ url, reqQuery, reqBody });
    return res.data ?? [];
}

export const apiUpdateUserInfo = async ({ reqQuery, reqBody }: {
    reqQuery?: any, reqBody: {
        userId: string,
        status: number,
        type: number
    }
}): Promise<{ data: UserInfo, status: number }> => {
    const url = 'userInfos/updateUserInfo';
    const res = await POST_API({ url, reqQuery, reqBody });
    return res.data ?? [];
}

export const apiDeleteUserInfo = async ({ reqQuery }: {
    reqQuery?: { userId: string }
}): Promise<{ data: UserInfo, status: number }> => {
    const url = 'userInfos/deleteUserInfo';
    const res = await POST_API({ url, reqQuery });
    return res.data ?? [];
}


export const apiGetUserInfoByUserIds = async ({ reqQuery, reqBody }: {
    reqQuery?: any, reqBody: {
        userIds: string[],
    }
}): Promise<{ data: UserInfo, status: number }> => {
    const url = 'userInfos/getUserInfoByUserIds';
    const res = await POST_API({ url, reqQuery, reqBody });
    return res.data ?? [];
}

export const apiupdateExtraUserInfo = async ({ reqQuery, reqBody }: {
    reqQuery?: any, reqBody: {
        userId: string,
        userInfoUpdate: Object,
        extraInfo: string
    }
}): Promise<{ data: UserInfo, status: number }> => {
    const url = 'userInfos/updateExtraUserInfo';
    const res = await POST_API({ url, reqQuery, reqBody });
    return res.data ?? [];
}

export const apiCheckPresidentSignIn = async (reqBody: { email: string, password: string }): Promise<{ data: ClubMember, token: string, status: number }> => {
    const url = 'userInfos/signInCms';
    const res = await POST_API({ url, reqBody });
    return res.data ?? [];
}

export const apiAuthorizeByToken = async (reqBody: { token: string }): Promise<{ data: ClubMember, status: number }> => {
    const url = 'userInfos/authorizeByToken';
    const res = await POST_API({ url, reqBody });
    return res.data ?? [];
}


