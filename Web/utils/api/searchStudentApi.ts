import { GET_API, POST_API } from ".";

export const apiSearchStudent = async ({ reqQuery }: {
    reqQuery: {
        token: string,
        sessionId: string,
        keyword: string
    }
}): Promise<any[]> => {
    const url = 'search/studentALumi';
    const res = await GET_API({ url, reqQuery });
    if (res.status !== 200) return [];
    if (res?.data?.status === 0) {
        return [];
    }
    return res.data?.data ?? [];
}