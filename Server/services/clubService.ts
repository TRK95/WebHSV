import { ClubModel } from "../database/mongo/Club";
import { ClubCategoryModel } from "../database/mongo/ClubCategory";
import { ClubMemberModel } from "../database/mongo/ClubMember";
import Club from "../models/Club";

export default class ClubService {
    async getClubsByType(args: {
        limit?: number,
        offset?: number,
        type?: number,
        status?: number
    }) {
        const { limit, offset, type, status } = args;
        if (limit && offset !== undefined) {
            const clubsList = await ClubModel.find({
                status: status,
                type: type
            })
                .sort({ createDate: -1 })
                .skip(offset)
                .limit(limit)
                .exec();
            const total = await (
                await ClubModel.find({
                    status: status,
                    type: type,
                })
            ).length;
            const result = {
                data: await Promise.all(
                    clubsList.map(async (item) => {
                        const clubInCategory = await ClubCategoryModel.find({
                            _id: item.categoryId,
                        });

                        const club = new Club(item);
                        return { ...club, inCategories: clubInCategory };
                    })
                ),
                total: total,
                status: 0,
            };
            return result;
        }
        return { data: [], total: 0, status: -1 };
    }

    async getClubsByCategory(args: {
        categoryId?: string;
        status?: number
    }) {
        const { categoryId, status } = args;
        if (categoryId) {
            const clubsList = await ClubModel.find({
                status: status,
                categoryId: categoryId
            });

            const total = await ClubModel.find({
                status: status,
                categoryId: categoryId
            }).countDocuments();

            const result = {
                data: await Promise.all(
                    clubsList.map(async (item) => {
                        const clubInCategory = await ClubCategoryModel.find({
                            _id: item.categoryId,
                        });

                        const club = new Club(item);
                        return { ...club, inCategories: clubInCategory };
                    })
                ),
                total: total,
                status: 0,
            };
            return result;
        }
        return { data: [], total: 0, status: -1 };
    }

    async getClubsBySlug(args: { slug?: string }) {
        const { slug } = args;
        const club = await ClubModel.findOne({ slug: slug });

        if (club) {
            const result = {
                data: club,
                status: 0,
            };
            return result;
        }
        const result = {
            data: null,
            status: 0,
        };
        return result;
    }

    async getClubsByPresidentId(args: { presidentId?: string }) {
        const { presidentId } = args;
        const club = await ClubModel.find({ presidentId: presidentId });

        if (club) {
            const result = {
                data: club,
                status: 0,
            };
            return result;
        }
        const result = {
            data: null,
            status: 0,
        };
        return result;
    }

    async getClubsById(args: { clubId?: string }) {
        const { clubId } = args;
        const club = await ClubModel.findOne({ _id: clubId });

        if (club) {
            const result = {
                data: club,
                status: 0,
            };
            return result;
        }
        const result = {
            data: null,
            status: 0,
        };
        return result;
    }

    async getClubsByName(args: { name?: string }) {
        const { name } = args;
        const club = await ClubModel.findOne({ name: name });

        if (club) {
            const result = {
                data: club,
                status: 0,
            };
            return result;
        }
        const result = {
            data: null,
            status: 0,
        };
        return result;
    }

    async updateClub(args: Club) {
        const {
            _id,
            name,
            des,
            shortDes,
            slug,
            categoryId,
            status,
            ownerId,
            createDate,
            type,
            categoryName,
            avatar,
            showMem,
            settingStatus,
            president,
            presidentId,
            contactInfo
        } = args;
        if (_id) {
            const oldClub = await ClubModel.findById(_id);
            if (oldClub?.categoryId !== categoryId) {
                await ClubCategoryModel.findByIdAndUpdate(
                    oldClub?.categoryId,
                    { $inc: { clubNum: -1 } }
                );

                await ClubCategoryModel.findByIdAndUpdate(
                    categoryId,
                    { $inc: { clubNum: 1 } }
                );
            }
            const clubMemberCount = await ClubMemberModel.countDocuments({ clubId: _id });
            const updateClub = await ClubModel.findByIdAndUpdate(_id,
                {
                    name: name,
                    des: des,
                    shortDes: shortDes,
                    slug: slug,
                    categoryId: categoryId,
                    status: status,
                    ownerId: ownerId,
                    createDate: createDate,
                    type: type,
                    categoryName: categoryName,
                    memNum: clubMemberCount,
                    avatar: avatar,
                    showMem: showMem,
                    settingStatus: settingStatus,
                    president: president,
                    presidentId: presidentId,
                    contactInfo: contactInfo
                },
                {
                    new: true,
                });

            const result = {
                data: updateClub,
                status: 0,
            };

            return result;
        }

        const createdAt = new Date();
        const newClub = new ClubModel({
            name: name,
            des: des,
            shortDes: shortDes,
            slug: slug,
            categoryId: categoryId,
            status: status,
            ownerId: ownerId,
            createDate: createdAt.getTime(),
            type: type,
            categoryName: categoryName,
            memNum: president ? 1 : 0,
            avatar: avatar,
            showMem: showMem,
            settingStatus: settingStatus,
            president: president,
            presidentId: presidentId,
            contactInfo: contactInfo
        });
        const data = await newClub.save();
        await ClubCategoryModel.findByIdAndUpdate(
            categoryId,
            { $inc: { clubNum: 1 } }
        );
        const result = {
            data: data,
            status: 0,
        };

        return result;
    }

    async getUserClub(args: { userId?: string, status?: number }) {
        const { userId, status } = args;
        if (userId && status) {
            const matchClubMember = await ClubMemberModel.find({ userId: userId, status: status });
            if (matchClubMember) {
                const matchClubId = matchClubMember.map(item => item.clubId);
                const matchClub = await ClubModel.find({ _id: { $in: matchClubId } });
                if (matchClub) {
                    return {
                        data: matchClub,
                        total: matchClubId.length,
                        status: 0
                    };
                }
            }
        }
        return {
            data: null,
            total: 0,
            status: 0
        };
    }
}