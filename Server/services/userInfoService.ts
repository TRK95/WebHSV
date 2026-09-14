import { TokenExpiredError, verify } from "jsonwebtoken";
import { jwtCmsHSV } from "../constraint";
import { ClubMemberModel } from "../database/mongo/ClubMember";
import { UserModel } from "../database/mongo/User";
import { UserInfoModel } from "../database/mongo/UserInfo";
import UserInfo, { UserInfoI } from "../models/UserInfo";
import { TYPE_CHECKIN_ALL, TYPE_CHECKIN_DONE, TYPE_CHECKIN_NOT } from "../utils/contrants";
import { getDecryptedText, getEncryptedText } from "../utils/encryption";
const jwt = require('jsonwebtoken');

const ONE_DAY_AGO = 24 * 60 * 60 * 1000;
export default class UserInfoService {
    async getUserInfoByDate(args: { status: number, numberDaysAgo: number, limit: number, offset: number, type?: number }) {
        const { status, numberDaysAgo, limit, offset, type } = args;
        const currentDate = Date.now();
        const daysAgo = currentDate - (numberDaysAgo * ONE_DAY_AGO);
        let userInfos: UserInfo[];
        let total: number;

        if (status === TYPE_CHECKIN_ALL) {
            if (type as number >= 0) {
                userInfos = await UserInfoModel.find({ type: type })
                    .sort({ createDate: -1 })
                    .skip(offset)
                    .limit(limit)
                    .exec();
                total = await (
                    await UserInfoModel.find({ type: type })
                ).length;
            } else {
                userInfos = await UserInfoModel.find({})
                    .sort({ createDate: -1 })
                    .skip(offset)
                    .limit(limit)
                    .exec();
                total = await (
                    await UserInfoModel.find({})
                ).length;
            }
        } else if (status === TYPE_CHECKIN_DONE) {
            userInfos = await UserInfoModel.find({
                lastCheckin: {
                    $gte: daysAgo,
                    $lte: currentDate
                },
                status: TYPE_CHECKIN_DONE
            })
                .sort({ createDate: -1 })
                .skip(offset)
                .limit(limit)
                .exec();
            total = await (
                await UserInfoModel.find({
                    lastCheckin: {
                        $gte: daysAgo,
                        $lte: currentDate
                    },
                    status: TYPE_CHECKIN_DONE
                })
            ).length;
        } else {
            userInfos = await UserInfoModel.find({ status: status })
                .sort({ createDate: -1 })
                .skip(offset)
                .limit(limit)
                .exec();
            total = await (
                await UserInfoModel.find({ status: status })
            ).length;
        }

        const result = {
            data: userInfos,
            total: total,
            status: 0,
        };
        return result;
    }
    async createNewUserInfo(args: UserInfoI) {
        const time = new Date();
        const checkExistUserInfo = await UserInfoModel.findOne({ userId: args.userId });
        if (checkExistUserInfo) {
            return {
                data: checkExistUserInfo,
                status: 0
            };
        }
        const userInfoNew = new UserInfoModel({
            ...args,
            password: args.userId,
            createDate: time.getTime(),
            lastCheckin: -1,
        });
        await userInfoNew.save();

        const result = {
            data: userInfoNew,
            status: 0,
        };
        return result;
    }

    async getUserInfoById(args: { id: string }) {
        const { id } = args;
        const userInfo = await UserInfoModel.findById(id);
        if (userInfo) {
            const result = {
                data: userInfo,
                status: 0,
            };
            return result;
        }
        return {
            data: null,
            status: 0,
        };
    }

    async getUserInfoByUserId(args: { userId: string }) {
        const { userId } = args;
        const userInfo = await UserInfoModel.findOne({ userId: userId, });
        if (userInfo) {
            const result = {
                data: userInfo,
                status: 0,
            };
            return result;
        }
        return {
            data: null,
            status: 0,
        };
    }

    async getUserInfoByUserName(args: { name: string }) {
        const { name } = args;
        const regex = new RegExp(name, 'i');
        const userInfo = await UserInfoModel.find({ fullName: regex });
        if (userInfo) {
            const result = {
                data: userInfo,
                status: 0,
            };
            return result;
        }
        return {
            data: null,
            status: 0,
        };
    }

    async getUserInfoByEmail(args: { email: string, userId?: string }) {
        const { email, userId } = args;
        if (userId) {
            const userInfo = await UserInfoModel.find({ email: email, userId: userId });
            const result = {
                data: userInfo,
                status: 0,
            };
            return result;
        }
        const userInfo = await UserInfoModel.find({ email: email, });
        const result = {
            data: userInfo,
            status: 0,
        };
        return result;
    }

    async updateUserInfo(args: UserInfo) {
        const { _id,
            userId,
            password,
            status,
            fullName,
            birthdate,
            className,
            schoolName,
            year,
            phoneNumber,
            email,
            studentYear,
            avatarUrl,
            homeProvince,
            createDate,
            lastCheckin } = args;
        if (_id) {
            const updateUserInfo = await UserInfoModel.findByIdAndUpdate(_id,
                {
                    userId,
                    password: password,
                    status,
                    fullName,
                    birthdate,
                    className,
                    schoolName,
                    year,
                    phoneNumber,
                    email,
                    studentYear,
                    avatarUrl: avatarUrl,
                    homeProvince,
                    createDate,
                    lastCheckin
                },
                {
                    new: true,
                });
            if (updateUserInfo) {
                const userClubMembers = await ClubMemberModel.find({ userId: _id });
                if (userClubMembers && userClubMembers.length > 0) {
                    const userClubMember = {
                        userId: userId,
                        clubIds: userClubMembers.map(member => member.clubId),
                        userInfo: updateUserInfo
                    };
                    const token = jwt.sign({ userClubs: userClubMember }, jwtCmsHSV, { expiresIn: '2h' });
                    return { data: userClubMember, token: token, status: 1 };
                }
                return { data: null, token: '', status: 0 };
            }
        }
        return {
            data: null,
            token: '',
            status: 0
        };
    }

    async deleteUserInfo(args: { userId?: string }) {
        const { userId } = args;
        const userInfo = await UserInfoModel.findOneAndDelete({ userId: userId });
        return {
            data: userInfo,
            status: 0
        };
    }

    async getUserInfoByUserIds(args: { userIds: string[] }) {
        const { userIds } = args;
        const userInfos = await Promise.all(
            userIds.map(async (userId) => {
                const data = await UserInfoModel.findOne({ userId: userId });
                if (data) {
                    const userInfo = new UserInfo(data);
                    return userInfo;
                }
                return null;
            })
        );
        const result = {
            data: userInfos.filter((item) => item !== null),
            status: 0,
        };
        return result;
    }

    async checkPresidentSignIn(args: { email: string, password: string }) {
        const { email, password } = args;
        if (email && password) {
            const userSignIn = await UserInfoModel.findOne({ email: email, password: password });
            if (userSignIn) {
                const userClubMember = await ClubMemberModel.find({ userId: userSignIn?._id });
                if (userClubMember) {
                    const checkIsPresident = userClubMember.find(item => item.role === 1);
                    if (checkIsPresident) {
                        const token = jwt.sign({ _id: checkIsPresident._id, userId: checkIsPresident.userId, clubId: checkIsPresident.clubId, student: checkIsPresident.student }, jwtCmsHSV, { expiresIn: '2h' });
                        return { data: checkIsPresident, token: token, status: 0 };
                    }
                    return { data: null, token: '', status: 0 };
                }
            }
        }
        return { data: null, token: "", status: -1 };
    }

    async authorizeByToken(args: { token: string }) {
        const { token } = args;
        if (token) {
            try {
                const data = verify(token, jwtCmsHSV);
                return { data: data, status: 0 };
            } catch (error) {
                if (error instanceof TokenExpiredError) {
                    return { data: null, status: 0 };
                }
                throw error;
            }
        }
        return { data: null, status: 0 };
    }

    async checkMemberSignIn(args: { email: string, password: string }) {
        const { email, password } = args;
        if (email && password) {
            const userSignIn = await UserInfoModel.findOne({ email: email, password: password });
            if (userSignIn) {
                const userClubMembers = await ClubMemberModel.find({ userId: userSignIn._id });
                if (userClubMembers && userClubMembers.length > 0) {
                    const userClubMember = {
                        userId: userSignIn.userId,
                        clubIds: userClubMembers.map(member => member.clubId),
                        userInfo: userSignIn
                    };
                    const token = jwt.sign({ userClubs: userClubMember }, jwtCmsHSV, { expiresIn: '2h' });
                    return { data: userClubMember, token: token, status: 1 };
                }
                return { data: null, token: '', status: 0 };
            }
        }
        return { data: null, token: "", status: -1 };
    }

    async changePassword(args: { userId?: string, oldPassword?: string, newPassword?: string }) {
        const { userId, oldPassword, newPassword } = args;
        if (userId && oldPassword && newPassword) {
            const matchUser = await UserInfoModel.findById(userId);
            let updateUser;
            if (matchUser?.userId !== matchUser?.password) {
                const decryptedStoredPassword = getDecryptedText(matchUser?.password);
                const decryptedOldPassword = getDecryptedText(oldPassword);
                if (decryptedStoredPassword === decryptedOldPassword) {
                    const encryptedNewPassword = getEncryptedText(newPassword);
                    updateUser = await UserInfoModel.findByIdAndUpdate(
                        userId,
                        {
                            password: encryptedNewPassword
                        },
                        {
                            new: true,
                        }
                    );
                    if (updateUser) {
                        return {
                            data: updateUser,
                            status: 1
                        };
                    }
                }
            }
            const oldDecryptPass = getDecryptedText(oldPassword);
            updateUser = await UserInfoModel.findOneAndUpdate(
                {
                    _id: userId,
                    password: oldDecryptPass
                },
                {
                    password: newPassword
                },
                {
                    new: true,
                }
            );
            if (updateUser) {
                return {
                    data: updateUser,
                    status: 1
                };
            }
            return { data: null, status: 0 };
        }
        return { data: null, status: -1 };
    }
}