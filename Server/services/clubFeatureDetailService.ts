import { ClubFeatureDetailModel } from "../database/mongo/ClubFeatureDetail";
import { FeatureDetailMemberModel } from "../database/mongo/FeatureDetailMember";
import { UserInfoModel } from "../database/mongo/UserInfo";
import ClubFeatureDetail from "../models/ClubFeatureDetail";

export default class ClubFeatureDetailService {
    async getClubFeatureDetailByClubId(args: {
        limit?: number,
        offset?: number,
        clubId?: string,
        status?: number
    }) {
        const { limit, offset, clubId, status } = args;
        if (limit && offset !== undefined) {
            const clubFeatureDetailList = await ClubFeatureDetailModel.find({
                clubId: clubId,
                status: status
            })
                .sort({ createDate: -1 })
                .skip(offset)
                .limit(limit)
                .exec();
            const total = await ClubFeatureDetailModel.find({
                clubId: clubId,
                status: status
            }).countDocuments();
            return { data: clubFeatureDetailList, total: total, status: 0 };
        }
        return { data: [], total: 0, status: -1 };
    }

    async getClubFeatureDetailByFeatureId(args: {
        limit?: number,
        offset?: number,
        featureId?: string,
        status?: number
    }) {
        const { limit, offset, featureId, status } = args;
        if (limit && offset !== undefined) {
            const clubFeatureDetailList = await ClubFeatureDetailModel.find({
                featureId: featureId,
                status: status
            })
                .sort({ createDate: -1 })
                .skip(offset)
                .limit(limit)
                .exec();
            const total = await ClubFeatureDetailModel.find({
                featureId: featureId,
                status: status
            }).countDocuments();
            return { data: clubFeatureDetailList, total: total, status: 0 };
        }
        return { data: [], total: 0, status: -1 };
    }

    async updateClubFeatureDetail(args: ClubFeatureDetail) {
        const { _id,
            title,
            content,
            criteria,
            shortDes,
            avatar,
            slug,
            featureId,
            clubId,
            status,
            createDate,
            docUrl,
            fromDate,
            toDate,
            settingStatus,
            registerFromDate,
            registerToDate,
            memNum,
            contentType } = args;
        const createdAt = new Date();
        if (_id) {
            const updateClubFeatureDetail = await ClubFeatureDetailModel.findByIdAndUpdate(
                _id,
                {
                    title: title,
                    content: content,
                    criteria: criteria,
                    shortDes: shortDes,
                    avatar: avatar,
                    slug: slug,
                    featureId: featureId,
                    clubId: clubId,
                    status: status,
                    createDate: createDate,
                    lastUpdate: createdAt.getTime(),
                    docUrl: docUrl,
                    fromDate: fromDate,
                    toDate: toDate,
                    settingStatus: settingStatus,
                    registerFromDate: registerFromDate,
                    registerToDate: registerToDate,
                    memNum: memNum,
                    contentType: contentType
                },
                { new: true }
            );
            const result = {
                data: updateClubFeatureDetail,
                status: 0
            };
            return result;
        }
        const newClubFeatureDetail = new ClubFeatureDetailModel({
            title: title,
            content: content,
            criteria: criteria,
            shortDes: shortDes,
            avatar: avatar,
            slug: slug,
            featureId: featureId,
            clubId: clubId,
            status: status,
            createDate: createdAt.getTime(),
            docUrl: docUrl,
            fromDate: fromDate,
            toDate: toDate,
            settingStatus: settingStatus,
            registerFromDate: registerFromDate,
            registerToDate: registerToDate,
            memNum: memNum,
            contentType: contentType
        });
        const data = await newClubFeatureDetail.save();
        return { data: data, status: 0 };
    }

    async getClubFeatureDetailBySlug(args: {
        slug?: string,
        featureId?: string
    }) {
        const { slug, featureId } = args;
        const featureDetail = await ClubFeatureDetailModel.findOne({ slug: slug, featureId: featureId });
        if (featureDetail)
            return { data: featureDetail, status: 0 };
        return { data: null, status: 0 };
    }

    async joinClubFeature(args: {
        user?: any;
        featureDetailId?: string;
        note?: string;
        status?: number
    }) {
        const { user, featureDetailId, note, status } = args;
        const time = new Date();
        try {
            const checkUserInfo = await UserInfoModel.findOne({ userId: user?.userId });
            if (checkUserInfo) {
                const checkFeatureMember = await FeatureDetailMemberModel.findOne({ userId: checkUserInfo?._id, featureDetailId: featureDetailId, status: { $ne: -1 } });
                if (checkFeatureMember) {
                    return { data: null, status: 2 };
                }

                const eventMember = new FeatureDetailMemberModel({
                    userId: checkUserInfo?._id,
                    featureDetailId: featureDetailId,
                    note: note,
                    joinDate: time.getTime(),
                    status: status,
                    student: checkUserInfo
                });

                await eventMember.save();
                if (status === 1) {
                    await ClubFeatureDetailModel.findByIdAndUpdate(featureDetailId, { $inc: { memNum: 1 } });
                }
                const result = {
                    data: eventMember,
                    status: 0,
                };
                return result;
            }

            const userInfoNew = new UserInfoModel({
                ...user,
                password: user?.userId,
                createDate: time.getTime(),
                lastCheckin: -1,
            });
            await userInfoNew.save();
            const eventMember = new FeatureDetailMemberModel({
                userId: userInfoNew?._id,
                featureDetailId: featureDetailId,
                note: note,
                joinDate: time.getTime(),
                status: status,
                student: userInfoNew
            });

            await eventMember.save();

            if (status === 1) {
                await ClubFeatureDetailModel.findByIdAndUpdate(featureDetailId, { $inc: { memNum: 1 } });
            }
            const result = {
                data: eventMember,
                status: 0,
            };
            return result;
        } catch (err) {
            console.log(err);
            return {
                data: null,
                status: -1,
            };
        }
    }

    async approveClubFeature(args: {
        userId?: string;
        featureDetailId?: string;
        status?: number;
    }) {
        const { userId, featureDetailId, status } = args;
        const time = new Date();
        try {
            const oldEventMember = await FeatureDetailMemberModel.findOne({ userId: userId, featureDetailId: featureDetailId });
            const oldStatus = oldEventMember?.status;
            const eventMember = await FeatureDetailMemberModel.findOneAndUpdate(
                { userId: userId, featureDetailId: featureDetailId },
                { status: status, joinDate: time.getTime() },
                { new: true }
            );

            if (status === -1)
                await FeatureDetailMemberModel.findOneAndDelete({ userId: userId, featureDetailId: featureDetailId });

            if ((oldStatus === 0 || oldStatus === -1) && status === 1)
                await ClubFeatureDetailModel.findByIdAndUpdate(featureDetailId, { $inc: { memNum: 1 } });
            if (oldStatus === 1 && status === -1)
                await ClubFeatureDetailModel.findByIdAndUpdate(featureDetailId, { $inc: { memNum: -1 } });
            if ((oldStatus === 1 || oldStatus === -1) && status === 0)
                await ClubFeatureDetailModel.findByIdAndUpdate(featureDetailId, { $inc: { memNum: -1 } });

            if (eventMember) {
                const result = {
                    data: eventMember,
                    status: 0,
                };
                return result;
            }
            return {
                data: null,
                status: 0,
            };
        } catch (err) {
            return {
                data: null,
                status: -1,
            };
        }
    }

    async getMemberFeatureDetail(args: {
        featureDetailId?: string;
        offset?: number;
        limit?: number;
    }) {
        const { featureDetailId, offset, limit } = args;

        if (limit && offset !== undefined && featureDetailId) {
            const eventMemberList = await FeatureDetailMemberModel.find({
                featureDetailId: featureDetailId,
                status: { $ne: -1 }
            })
                .sort({ createDate: -1 })
                .skip(offset)
                .limit(limit)
                .exec();
            const total = await FeatureDetailMemberModel.find({ eventId: FeatureDetailMemberModel, status: { $ne: -1 } }).countDocuments();

            const result = {
                data: eventMemberList,
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

    async getMemberInfoFeatureDetail(args: {
        featureDetailId?: string;
        offset?: number;
        limit?: number;
    }) {
        const { featureDetailId, offset, limit } = args;

        if (limit && offset !== undefined && featureDetailId) {
            const eventMemberList = await FeatureDetailMemberModel.find({
                featureDetailId: featureDetailId,
            })
                .sort({ createDate: -1 })
                .skip(offset)
                .limit(limit)
                .exec();
            const userIds = eventMemberList.map((member) => member.userId);
            const userInfoList = await UserInfoModel.find({ _id: { $in: userIds } });

            const total = await FeatureDetailMemberModel.find({ featureDetailId: featureDetailId }).countDocuments();

            const result = {
                data: userInfoList,
                total: total,
                status: 0,
            };
            return result;
        }
        const result = {
            data: [],
            total: 0,
            status: 1,
        };
        return result;
    }
}