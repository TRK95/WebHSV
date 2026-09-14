import { RESPONSE_FAILED } from "@/utils/contrants";
import { GET_API, GET_HUST_API, POST_API } from ".";

export const apiSearchStudent = async (reqQuery: {
    keyword: string
}): Promise<any[]> => {
    const url = 'search/studentALumi';
    // const res = await GET_API({ url, reqQuery });
    const res = await GET_HUST_API({ url, reqQuery });
    if (res.status !== 200) return [];
    if (res?.data?.status !== 1) {
        return [];
    }
    return res.data?.data ?? [];
}