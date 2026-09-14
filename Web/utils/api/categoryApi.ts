import { post } from "../fetcher";

export const apiGetCategory = async () => {
    const { data, error } = await post({
        endpoint: "/api/get-categories",
    });
    return error ? [] : data;
}