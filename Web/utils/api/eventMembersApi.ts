import { POST_API } from ".";
import EventMember from "../../models/EventMember";
import { RESPONSE_FAILED } from "../constraint";

export const apiGetMembersEvent = async ({ reqQuery }: {
    reqQuery: any
}): Promise<{
    data: EventMember[],
    status: number,
    total?: number
}> => {
    const url = 'news/getMemberEvents';
    const res = await POST_API({ url, reqQuery });
    if (res.status !== 200) return {
        data: [],
        status: RESPONSE_FAILED
    };
    return res.data ?? [];
}