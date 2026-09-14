import { POST_API, responseLoad } from ".";
import ClubMember from "../../models/ClubMember";
import { RESPONSE_FAILED } from "../constraint";

export type reqQueryClubMember = {
    limit: number,
    offset: number,
    clubId: number
}

export const apiGetMemberClubs = async ({ reqQuery }: { reqQuery?: any }): Promise<responseLoad> => {
    const url = 'club/getMemberClubs';
    const res = await POST_API({ url, reqQuery });
    if (res.status !== 200) return {
        data: [],
        status: RESPONSE_FAILED
    };
    return res.data ?? {};
}

export const apiApproveClub = async (reqQuery: {
    studentId: string,
    clubId: number,
    status: number
}): Promise<{
    data: ClubMember | null,
    status: number
}> => {
    const url = 'club/approveClub';
    const res = await POST_API({ url, reqQuery });
    if (res.status !== 200) return {
        data: null,
        status: RESPONSE_FAILED
    };
    return res.data ?? {};
}

export const apiSetPresidentClub = async (reqQuery: {
    studentId: string,
    clubId: number
}): Promise<{
    data: ClubMember | null,
    status: number
}> => {
    const url = 'club/setPresidentClub';
    const res = await POST_API({ url, reqQuery });
    if (res.status !== 200) return {
        data: null,
        status: RESPONSE_FAILED
    };
    return res.data ?? {};
}

export const apijoinClub = async ({ reqQuery }: { reqQuery?: any }): Promise<{
    data: ClubMember,
    status: number
}> => {
    const url = 'club/joinClub';
    const res = await POST_API({ url, reqQuery });
    return res.data ?? {};
}

export const apiUpdateRole = async (reqQuery: {
    studentId: string,
    clubId: number,
    role: number
}): Promise<{
    data: ClubMember | string,
    status: number
}> => {
    const url = 'club/updateRole';
    const res = await POST_API({ url, reqQuery });
    if (res.status !== 200) return {
        data: '',
        status: RESPONSE_FAILED
    };
    return res.data ?? {};
}

