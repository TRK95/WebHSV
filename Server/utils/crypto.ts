import CryptoJS from 'crypto-js';
import logger from './logger';
const secret_key = 'TbEQb0TDG9D64Xt544xLFofSBmxtJ7l6';
const SECRET_KEY_JOIN_CLASS = "QLLH-2021";
export function encrypt(data: string): string {
    return CryptoJS.AES.encrypt(data, secret_key).toString();
}

export function decrypt(encrypted: string): string {
    const bytes = CryptoJS.AES.decrypt(encrypted, secret_key);
    return bytes.toString(CryptoJS.enc.Utf8);
}

export const enCryptClientPass = (_clientPass: string): string => {
    return CryptoJS.AES.encrypt(_clientPass, SECRET_KEY_JOIN_CLASS).toString();
};
export const decryptClientPass = (_clientPass: string): string => {
    const bytes = CryptoJS.AES.decrypt(_clientPass, SECRET_KEY_JOIN_CLASS);
    return bytes.toString(CryptoJS.enc.Utf8);
};
export function encodeSHA256Pass(userName: string, password: string) {
    try {
        const encode = CryptoJS.SHA256(`${password}_${userName}_${password}`).toString();
        return encode;
    } catch (error) {
        logger.error('error ', error);
        return null;
    }
}

export function encodeSHA256Code(obj: any, key: string) {
    try {
        const encode = CryptoJS.SHA256(`${JSON.stringify(obj)}_${key}`).toString();
        return encode;
    } catch (error) {
        logger.error('error ', error);
        return null;
    }
}
