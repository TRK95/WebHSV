import { post } from "../fetcher"

export const getQrPaymentApi = async (body: {
    transactionAmount: number;
    referenceLabelCode: string;
}) => {
    const { data, error } = await post({
        endpoint: process.env.NEXT_PUBLIC_API_GET_QRPAYMENT || "",
        body
    })
    return error ? {} : data;
}