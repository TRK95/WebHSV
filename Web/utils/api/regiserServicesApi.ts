import { GET_API, POST_API } from ".";
import EventModel from "../../models/eventModel";
import Service from "../../models/serviceModel";
import { RESPONSE_FAILED } from "../constraint";

export const apiUpdateEvent = async (reqBody: EventModel): Promise<{
    data: EventModel | null,
    status: number
}> => {
    const url = 'news/updateEvent';
    const res = await POST_API({ url, reqBody });
    if (res.status !== 200) return {
        data: null,
        status: RESPONSE_FAILED
    };
    return res.data ?? {};
}

export const apiGetEventBySlug = async (reqQuery: { slug: string }): Promise<{
    data: EventModel | null,
    status: number
}> => {
    const url = 'news/getEventsBySlug';
    const res = await GET_API({ url, reqQuery });
    if (res.status !== 200) return {
        data: null,
        status: RESPONSE_FAILED
    };
    return res.data ?? {};
}