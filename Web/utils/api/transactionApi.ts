import Transaction from "../../models/transaction";
import { post } from "../fetcher";

export const createTransactionApi = async (data: Transaction) => {
    const res = await post({
        endpoint: '/api/create-transaction',
        body: data
    })
    return res.error ? {} : res.data;
}