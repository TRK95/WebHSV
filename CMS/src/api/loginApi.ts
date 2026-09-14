import { RESPONSE_FAILED } from "@/utils/contrants";
import { POST_API_CMS } from ".";

export const apiLogin = async (reqBody: {
    username: string,
    password: string
}): Promise<{
    data: any,
    status: number
}> => {
    const url = 'cms-alumni/login';
    const res = await POST_API_CMS({ url, reqBody });
    return res ?? {};
}