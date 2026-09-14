import ClubMember from "@/models/ClubMember";
import Event from "@/models/Event";
import EventMember from "@/models/EventMember";
import { RESPONSE_FAILED } from "@/utils/contrants";
import { GET_API, POST_API, responseLoad } from ".";
import { UserInfoI } from "@/models/UserInfo";

export type reqQueryEvents = {
    limit: number,
    offset: number,
    status: number
}

export const apiGetEvent = async (reqQuery: reqQueryEvents): Promise<responseLoad> => {
    const url = 'events/getEventsByDate';
    const res = await POST_API({ url, reqQuery });
    if (res.status !== 200) return {
        data: [],
        status: RESPONSE_FAILED
    };
    return res.data ?? {};
}

export const apiUpdateEvent = async (reqBody: Event): Promise<{
    data: Event | null,
    status: number
}> => {
    const url = 'events/updateEvent';
    const res = await POST_API({ url, reqBody });
    if (res.status !== 200) return {
        data: null,
        status: RESPONSE_FAILED
    };
    return res.data ?? {};
}

export const apiGetEventBySlug = async (reqQuery: { slug: string }): Promise<{
    data: Event | null,
    status: number
}> => {
    const url = 'events/getEventsBySlug';
    const res = await GET_API({ url, reqQuery });
    if (res.status !== 200) return {
        data: null,
        status: RESPONSE_FAILED
    };
    return res.data ?? {};
}

export const apiJoinEvent = async (reqQuery: {
    eventId: string,
    note: string,
    status: number
}, reqBody: {
    user: UserInfoI
}): Promise<{
    data: any,
    status: number
}> => {
    const url = 'events/joinEvent';
    const res = await POST_API({ url, reqQuery, reqBody });
    if (res.status !== 200) return {
        data: null,
        status: RESPONSE_FAILED
    };
    return res.data ?? {};
}

// export const apiApproveEvent = async (reqQuery: {
//     studentId: string,
//     // eventId: number, 
//     eventId: string,
//     status: number
// }): Promise<{
//     data: any,
//     status: number
// }> => {
//     const url = 'events/approveEvent';
//     const res = await POST_API({ url, reqQuery });
//     if (res.status !== 200) return {
//         data: null,
//         status: RESPONSE_FAILED
//     };
//     return res.data ?? {};
// }

export const apiApproveEvent = async (reqQuery: {
    userId: string,
    // eventId: number, 
    eventId: string,
    status: number
}): Promise<{
    data: any,
    status: number
}> => {
    const url = 'events/approveEvent';
    const res = await POST_API({ url, reqQuery });
    if (res.status !== 200) return {
        data: null,
        status: RESPONSE_FAILED
    };
    return res.data ?? {};
}


export const apiGetMemberEvent = async (reqQuery: {
    // eventId: number,
    eventId: string,
    offset: number,
    limit: number
}): Promise<{
    data: EventMember[],
    status: number,
    total?: number
}> => {
    const url = 'events/getMemberEvents';
    const res = await POST_API({ url, reqQuery });
    if (res.status !== 200) return {
        data: [],
        status: RESPONSE_FAILED
    };
    return res.data ?? {};
}

export const apiGetMemberInfoEvent = async (reqQuery: {
    // eventId: number,
    eventId: string,
    offset: number,
    limit: number
}): Promise<{
    data: EventMember[],
    status: number,
    total?: number
}> => {
    const url = 'events/getMemberInfoEvents';
    const res = await POST_API({ url, reqQuery });
    if (res.status !== 200) return {
        data: [],
        status: RESPONSE_FAILED
    };
    return res.data ?? {};
}

export const apiSearchEvent = async ({ reqQuery, reqBody }: { reqQuery?: any, reqBody?: any }): Promise<{ data: Event[] | null, total: number, status: number }> => {
    const url = 'search-events'
    const res = await POST_API({ url, reqQuery, reqBody });
    return res.data ?? [];
}
