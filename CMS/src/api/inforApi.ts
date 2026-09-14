import { GET_API, GET_HUST_API } from ".";

export const apiGetUnitTrainings = async (): Promise<{ data?: Array<{ name: string, id: number | null }>, status?: number }> => {
    const url = 'unitsTraning';
    const res = await GET_HUST_API({ url });
    if (res.status !== 200) return {};
    return res.data ?? {}
}

export const apiGetEduPrograms = async (): Promise<{ data?: Array<{ name: string, id: number | null }>, status?: number }> => {
    const url = 'getEduPrograms';
    const res = await GET_HUST_API({ url });
    if (res.status !== 200) return {};
    return res.data ?? {}
}
