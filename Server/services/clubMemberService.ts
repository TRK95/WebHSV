// import * as XLSX from 'xlsx';
import moment from "moment";
import { ClubMemberModel } from "../database/mongo/ClubMember";
import { STATUS_DELETED } from "../constraint";
import { ClubModel } from "../database/mongo/Club";
import { UserInfoModel } from "../database/mongo/UserInfo";
import { UserInfoI } from "../models/UserInfo";

const XLSX = require('xlsx');
export default class ClubMemberService {
    async getMemberClubs(args: {
        limit?: number,
        offset?: number,
        clubId?: string,
    }) {
        const { limit, offset, clubId } = args;
        if (limit && offset !== undefined && clubId) {
            const clubMemberList = await ClubMemberModel.find({
                clubId: clubId,
                status: { $ne: STATUS_DELETED }
            })
                .sort({ createDate: -1 })
                .skip(offset)
                .limit(limit)
                .exec();
            const total = await (
                await ClubMemberModel.find({ clubId: clubId, status: { $ne: STATUS_DELETED } })
            ).length;

            const result = {
                data: clubMemberList,
                total: total,
                status: 0,
            };
            return result;
        }
        const result = {
            data: [],
            total: 0,
            status: 0,
        };
        return result;
    }

    async getClubPresident(args: { clubId?: string }) {
        const { clubId } = args;
        const club = await ClubModel.findById(clubId);
        if (club) {
            const result = {
                data: club.president,
                status: 0
            };
            return result;
        }
        const result = {
            data: null,
            status: 0,
        };
        return result;
    }

    async approveClub(args: {
        userId?: string;
        clubId?: string;
        status?: number
    }) {
        const { userId, clubId, status } = args;
        const time = new Date();
        try {
            const oldClubMember = await ClubMemberModel.findOne({ userId: userId, clubId: clubId });
            const oldStatus = oldClubMember?.status;
            const clubMember = await ClubMemberModel.findOneAndUpdate(
                { userId: userId, clubId: clubId },
                { status: status, joinDate: time.getTime(), role: 0 },
                { new: true }
            );

            if ((oldStatus === 0 || oldStatus === -1) && status === 1)
                await ClubModel.findByIdAndUpdate(clubId, { $inc: { memNum: 1 } });
            if ((oldStatus === 0 || oldStatus === 1) && status === -1)
                await ClubModel.findByIdAndUpdate(clubId, { $inc: { memNum: -1 } });
            if ((oldStatus === 1 || oldStatus === -1) && status === 0)
                await ClubModel.findByIdAndUpdate(clubId, { $inc: { memNum: -1 } });

            if (clubMember) {
                const result = {
                    data: clubMember,
                    status: 0,
                };
                return result;
            }
            const result = {
                status: -1,
            };
            return result;
        } catch (err) {
            const result = {
                status: -1,
            };
            return result;
        }
    }

    async setPresidentClub(args: {
        user?: any,
        clubId?: string
    }) {
        const { user, clubId } = args;
        const president = await UserInfoModel.findOne({ userId: user?.userId });
        const time = new Date();
        if (president) {
            const checkPresidentClub = await ClubMemberModel.findOne({ userId: president?._id, clubId: clubId });
            if (checkPresidentClub && checkPresidentClub?.role === 0) {
                checkPresidentClub.role = 1;
                await checkPresidentClub.save();
                return { data: checkPresidentClub, status: 0, code: 1 };
            }
            if (!checkPresidentClub) {
                const clubMember = new ClubMemberModel({
                    userId: president?._id,
                    clubId: clubId,
                    role: 1,
                    joinDate: time.getTime(),
                    status: 1,
                    student: president
                });
                await clubMember.save();
                if (clubMember) {
                    const result = {
                        data: clubMember,
                        status: 0,
                        code: 2
                    };
                    return result;
                }
            }
        }
        const userInfoNew = new UserInfoModel({
            ...user,
            password: user?.userId,
            createDate: time.getTime(),
            lastCheckin: -1,
        });
        await userInfoNew.save();
        const clubMember = new ClubMemberModel({
            userId: userInfoNew?._id,
            clubId: clubId,
            role: 1,
            joinDate: time.getTime(),
            status: 1,
            student: userInfoNew
        });

        await clubMember.save();

        if (clubMember) {
            const result = {
                data: clubMember,
                status: 0,
                code: 3,
            };
            return result;
        }
        return { data: null, status: -1, };
    }

    async joinClub(args: {
        user?: UserInfoI,
        clubId?: string
    }) {
        const { user, clubId } = args;
        try {
            const checkUserInfoExist = await UserInfoModel.findOne({ userId: user?.userId });

            const checkClubMember = await ClubMemberModel.findOne({ userId: checkUserInfoExist?._id, clubId: clubId });
            if (checkClubMember) {
                return { data: null, status: 2 };
            }

            const time = new Date();
            const userInfoNew = new UserInfoModel({
                ...user,
                password: user?.userId,
                createDate: time.getTime(),
                lastCheckin: -1,
            });
            await userInfoNew.save();

            const clubMember = new ClubMemberModel({
                userId: userInfoNew?._id,
                clubId: clubId,
                role: 0,
                joinDate: time.getTime(),
                status: 1,
                student: userInfoNew
            });

            await ClubModel.findByIdAndUpdate(clubId, { $inc: { memNum: 1 } });

            await clubMember.save();

            const result = {
                data: clubMember,
                status: 0,
            };
            return result;
        } catch (err) {
            console.log(err);

            const result = {
                data: null,
                status: -1,
            };
            return result;
        }
    }

    async uploadMembers(args: { buffer: any, clubId?: string }) {
        const { buffer, clubId } = args;
        try {
            const workbook = XLSX.read(buffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const data = XLSX.utils.sheet_to_json(sheet);

            // Map users from the Excel sheet
            const users = data.map(row => ({
                fullName: row.fullName,
                className: row.className,
                phoneNumber: row.phoneNumber,
                birthdate: moment(row.birthdate, 'DD/MM/YYYY').valueOf(),
                createDate: moment(Date.now()).valueOf(),
                lastCheckin: moment(Date.now()).valueOf(),
                year: parseInt(row.userId.substring(0, 4)),
                userId: row.userId,
                email: row.email,
                schoolName: row.schoolName,
                studentYear: row.studentYear ? row.studentYear.slice(1) : "",
                avatarUrl: "",
                homeProvince: row.homeProvince,
                password: row.userId,
                status: 0,
            }));

            const time = new Date();
            const clubMembersPromises = users.map(async (user) => {
                let userInfo = await UserInfoModel.findOne({ userId: user.userId });

                if (!userInfo) {
                    // If user does not exist, insert into UserInfoModel
                    userInfo = new UserInfoModel(user);
                    await userInfo.save();
                }

                // Check if the user is already a member of the club
                const checkClubMember = await ClubMemberModel.findOne({ userId: userInfo._id, clubId: clubId });
                if (!checkClubMember) {
                    const clubMember = new ClubMemberModel({
                        userId: userInfo._id,
                        clubId: clubId,
                        role: 0,
                        joinDate: time.getTime(),
                        status: 1,
                        student: userInfo,
                    });
                    await clubMember.save();
                    return clubMember;
                }
                return null;
            });

            const createdClubMembers = await Promise.all(clubMembersPromises);

            await ClubModel.findByIdAndUpdate(clubId, { $inc: { memNum: createdClubMembers.filter(Boolean).length } });

            return { data: users, total: users.length, status: 0 };
        } catch (error) {
            console.error('Error uploading users:', error);
            return { data: [], total: 0, status: -1 };
        }
    }

    async updateRole(args: {
        userId?: string,
        clubId?: string,
        role?: number
    }) {
        const { userId, clubId, role } = args;
        // const oldClubMember = await ClubMemberModel.findOne({ userId: userId, clubId: clubId });
        // const oldRole = oldClubMember?.role;
        const clubMember = await ClubMemberModel.findOneAndUpdate(
            { userId: userId, clubId: clubId },
            { role: role },
            { new: true }
        );

        if (clubMember) {
            const result = {
                data: clubMember,
                status: 0
            };
            return result;
        }
        return { data: null, status: -1 };
    }
}