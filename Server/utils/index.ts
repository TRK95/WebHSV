import { sign, verify } from "jsonwebtoken"
import moment from 'moment';
import momentDurationFormat from 'moment-duration-format';
import mongoose from 'mongoose';
import { remove } from 'remove-accents';
import slugify from "slugify";
import { TokenData, VerifyEmailTokenData } from '../common/TokenData';
import { jwtSecret, jwtSecretNew, TOKEN_EXPIRED, TOKEN_FORGOT_PASS_EXPIRED } from '../constraint';
import logger from './logger';

momentDurationFormat(moment as any);

export function jwtSignRegisterToken(args: { userId: string; email: string; url: string }) {
    const payload: VerifyEmailTokenData = { _id: args.userId, email: args.email, url: args.url };
    return sign(payload, jwtSecretNew, { expiresIn: TOKEN_EXPIRED });
}

export function jwtVerifyRegisterToken(token: string) {
    try {
        const data = verify(token, jwtSecretNew);
        return data as VerifyEmailTokenData;
    } catch (e) {
        return null;
    }
}

export function jwtEncode(userId: any, userRoles?: any[], from?: number) {
    const payload: TokenData = { _id: userId, roles: [], from };
    if (userRoles) {
        payload.roles = userRoles.map((uRole) => ({
            itemId: uRole.itemId,
            mapActions: (uRole.role?.roleFunctions ?? []).reduce((map: { [funcId: number]: number[] }, rf) => {
                map[rf.id] = rf.actions || [];
                return map;
            }, {})
        }));
    }

    return sign(payload, jwtSecret, { expiresIn: TOKEN_EXPIRED });
}

export function jwtDecodeToken(token: string) {
    try {
        const decoded = verify(token, jwtSecret);
        return decoded;
    } catch (err) {
        return null;
    }
}

export function jwtEncodeForgotPass(userId: any, account: any) {
    return sign({ userId, account }, jwtSecret, { expiresIn: TOKEN_FORGOT_PASS_EXPIRED });
}

export function jwtClearToken(token: string) {
    try {
        const decoded = verify(token, jwtSecret);
        // console.log('okiii');
        if (decoded) {
            // console.log('okiii2 ', decoded);
            decoded['exp'] = decoded['exp'] - TOKEN_FORGOT_PASS_EXPIRED;
            sign(decoded, jwtSecret, {});
            // console.log('okiii3');
        }
    } catch (err) {
        logger.error('err ', err);
    }
}

export function jwtDecodeForgotPass(token: string) {
    try {
        const decoded = verify(token, jwtSecret);
        return decoded;
    } catch (err) {
        return null;
    }
}


export function convertModelToObject(model: any) {
    return JSON.parse(JSON.stringify(model));
}

export function isValidObjectId(objectId: any) {
    return mongoose.isValidObjectId(objectId); //true
}

export function removeAccents(str: string, joinChar?: string) {
    return str
        ? remove(str.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').split(' ').join(joinChar ?? '-'))
        : str;
}

export function getRandomInt(max: number) {
    return Math.floor(Math.random() * Math.floor(max));
}

export function getTimeFirstDay(date: any) {
    if (date) {
        date.setHours(0, 0, 0, 0);
        return new Date(date.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })).getTime();
    }
    return 0;
}

export function getCurrentTimeZone() {
    return new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })).getTime();
}

export function isEqualIds(id1: any, id2: any) {
    return String(id1) === String(id2);
}


export const formatDateYMD = (time?: number) => {
    return moment(time || Date.now()).format('YYYY/MM/DD');
};

export function sortObject(o: object) {
    const sorted = {};
    let key: string;
    const a: any[] = [];

    // eslint-disable-next-line no-restricted-syntax
    for (key in o) {
        if (o.hasOwnProperty(key)) {
            a.push(key);
        }
    }

    a.sort();

    for (let i: number = 0; i < a.length; i++) {
        sorted[a[i]] = o[a[i]];
    }
    return sorted;
}

export function sortObjectWithEncode(o: object) {
    const sorted = {};
    let key: string;
    const a: any[] = [];

    // eslint-disable-next-line no-restricted-syntax
    for (key in o) {
        if (o.hasOwnProperty(key)) {
            a.push(encodeURIComponent(key));
        }
    }
    a.sort();

    for (let i = 0; i < a.length; i++) {
        sorted[a[i]] = encodeURIComponent(o[a[i]]).replace(/%20/g, '+');
    }
    return sorted;
}

export const formatTimeClock = (time: number) => {
    return (moment.duration(time, 'seconds') as any).format('hh[h]:mm[m]:ss[s]', { trim: false });
};

export const formatFullDateTime = (timestamp?: number) => moment(timestamp).format('HH:mm:ss DD-MM-YYYY');


export const fixedPercent = (num: number) => Math.round((num + Number.EPSILON) * 100);

export const getSlug = (content: string) => slugify(content, { replacement: "-", remove: /[*{}+~.()?'"!:@]/g, lower: true, strict: true, locale: "vi" });

export const sortObjectNew = (o: object) => {
    return Object.keys(o).sort().reduce((obj, key) => (obj[key] = o[key], obj), {});
};
export const isObject = (arg?: any) => {
    return arg && (JSON.parse(JSON.stringify(arg))).constructor === Object;
}