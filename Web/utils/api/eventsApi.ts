import { GET_API, POST_API } from ".";
import EventMember from "../../models/EventMember";
import EventModel from "../../models/eventModel";
import { RESPONSE_FAILED } from "../constraint";

export const apiGetEventsByDate = async ({ reqQuery, reqBody }: { reqQuery?: any, reqBody?: any }): Promise<{ data: EventModel[], status: number, total: number }> => {
    const url = 'events/getEventsByDate';
    const res = await POST_API({ url, reqQuery, reqBody });
    return res.data ?? [];
}

export const apiGetEventBySlug = async ({ reqQuery }: { reqQuery?: any, reqBody?: any }): Promise<{ data: EventModel, status: number }> => {
    const url = 'events/getEventsBySlug';
    const res = await GET_API({ url, reqQuery });
    return res.data ?? {}
}

export const joinEvent = async ({ reqQuery, reqBody }: { reqQuery?: any, reqBody?: any }): Promise<{ data?: any, status?: number }> => {
    const url = 'events/joinEvent';
    const res = await POST_API({ url, reqQuery, reqBody });
    return res.data ?? {}
}

export const apiGetMyEvents = async ({ reqQuery }: { reqQuery?: any }): Promise<{ data?: Array<EventModel>, status?: number }> => {
    const url = 'events/getMyEvents';
    const res = await POST_API({ url, reqQuery });
    return res.data ?? []
}

export const apiUpdateEvent = async (reqBody: EventModel): Promise<{
    data: EventModel | null,
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

export const apiApproveEvent = async ({ reqQuery }: {
    reqQuery: {
        studentId: string,
        eventId: string,
        status: number
    }
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

export const apiGetMembersEvent = async ({ reqQuery }: {
    reqQuery: {
        eventId: string,
        offset: number,
        limit: number
    }
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