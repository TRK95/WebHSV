import ClubMember from "@/models/ClubMember";
import { RESPONSE_FAILED } from "@/utils/contrants";
import { GET_API, POST_API, responseLoad } from ".";
import UserInfo, { UserInfoI } from "@/models/UserInfo";
import axios from "axios";

export type reqQueryClubMember = {
    limit: number,
    offset: number,
    clubId: string
}

export const apiGetMemberClubs = async (reqQuery: reqQueryClubMember): Promise<responseLoad> => {
    const url = 'club/getMemberClubs';
    const res = await POST_API({ url, reqQuery });
    if (res.status !== 200) return {
        data: [],
        status: RESPONSE_FAILED
    };
    return res.data ?? {};
}

export const apiGetClubPresident = async (reqQuery: {
    clubId: string
}): Promise<{
    data: UserInfo | null,
    status: number
}> => {
    const url = 'club/getClubPresident';
    const res = await GET_API({ url, reqQuery });
    if (res.status !== 200) return {
        data: null,
        status: RESPONSE_FAILED
    };
    return res.data ?? {};
}

export const apiApproveClub = async (reqQuery: {
    userId: string,
    clubId: string,
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
    clubId: string
}, reqBody: { user: UserInfoI }): Promise<{
    data: ClubMember | null,
    status: number
}> => {
    const url = 'club/setPresidentClub';
    const res = await POST_API({ url, reqQuery, reqBody });
    if (res.status !== 200) return {
        data: null,
        status: RESPONSE_FAILED
    };
    return res.data ?? {};
}

export const apijoinClub = async (reqQuery: {
    clubId: string
}, reqBody: {
    user: UserInfoI
}): Promise<{
    data: ClubMember | null,
    status: number
}> => {
    const url = 'club/joinClub';
    const res = await POST_API({ url, reqQuery, reqBody });
    if (res.status !== 200) return {
        data: null,
        status: RESPONSE_FAILED
    };
    return res.data ?? {};
}

export const apiUploadMembers = async (file: File, clubId: string): Promise<responseLoad> => {
    const url = `${process.env.API_ENDPOINT}/api/club/uploadMembers`;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('clubId', clubId); // Append clubId to formData

    try {
        const res = await axios.post(url, formData, {
            params: {
                clubId: clubId
            },
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        if (res.status !== 200) {
            return { data: [], total: 0, status: RESPONSE_FAILED };
        }
        return res.data ?? {};
    } catch (error) {
        // Handle error
        console.error('Error uploading file:', error);
        return {
            data: [],
            total: 0,
            status: RESPONSE_FAILED
        };
    }
};

export const apiUpdateRole = async (reqQuery: {
    userId: string,
    clubId: string,
    role: number
}): Promise<{
    data: ClubMember | null,
    status: number
}> => {
    const url = 'club/updateRole';
    const res = await POST_API({ url, reqQuery });
    if (res.status !== 200) return {
        data: null,
        status: RESPONSE_FAILED
    };
    return res.data ?? {};
}

