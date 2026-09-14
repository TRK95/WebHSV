import process from "process";
import { GEN_CODE_TYPE_CHAR, GEN_CODE_TYPE_NUMBER } from "./contrants";

const development: boolean = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

export default function isDev(): boolean {
    return development;
}

export const isObject = (arg?: any) => {
    return arg && (JSON.parse(JSON.stringify(arg))).constructor === Object;
}
