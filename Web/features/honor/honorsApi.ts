import Honor from "../../models/honorModel";
import { POST_API } from "../../utils/api";

export const apiGetHonors = async ({ reqQuery, reqBody }: { reqQuery?: any, reqBody?: any }): Promise<{ data: Honor[], status: number, total: number }> => {
    const url = 'news/getHonors';
    const res = await POST_API({ url, reqQuery, reqBody });
    return res.data ?? [];
}
