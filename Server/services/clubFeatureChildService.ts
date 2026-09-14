import { ClubModel } from "../database/mongo/Club";
import { ClubFeatureChildModel } from "../database/mongo/ClubFeatureChild";
import ClubFeatureChild from "../models/ClubFeatureChild";

export default class ClubFeatureChildService {
    async getClubFeatureChild(args: {
        parentId?: string;
        status?: number;
    }) {
        const { parentId, status } = args;
        if (parentId === '-1' || parentId === "0" || parentId === undefined) {
            return { data: [], total: 0, status: -1 };
        }
        const clubCategoryChild = await ClubFeatureChildModel.find({
            status: status,
            parentId: parentId
        });
        const total = await ClubFeatureChildModel.find({
            status: status,
            parentId: parentId
        }).countDocuments();
        return { data: clubCategoryChild, total: total, status: 0 };
    }

    async getClubFeatureChildByClubSlug(args: {
        slug?: string;
        status?: number;
    }) {
        const { slug, status } = args;
        if (slug === '' || slug === undefined) {
            return { data: [], total: 0, status: -1 };
        }
        const clubDetail = await ClubModel.findOne({ slug: slug });
        const clubCategoryChild = await ClubFeatureChildModel.find({
            status: status,
            parentId: clubDetail?._id
        });
        const total = await ClubFeatureChildModel.find({
            status: status,
            parentId: clubDetail?._id
        }).countDocuments();
        return { data: clubCategoryChild, total: total, status: 0 };
    }

    async updateClubFeatureChild(args: ClubFeatureChild) {
        const { _id, title, shortDes, slug, parentId, status, createDate, type } = args;
        const createdAt = new Date();
        if (_id) {
            const updateClubFeatureChild = await ClubFeatureChildModel.findByIdAndUpdate(
                _id,
                {
                    title: title,
                    shortDes: shortDes,
                    slug: slug,
                    parentId: parentId,
                    status: status,
                    createDate: createDate,
                    lastUpdate: createdAt.getTime(),
                    type: type
                },
                {
                    new: true
                }
            );
            const result = {
                data: updateClubFeatureChild,
                status: 0
            };
            return result;
        }
        const newClubFeatureChild = new ClubFeatureChildModel({
            title: title,
            shortDes: shortDes,
            slug: slug,
            parentId: parentId,
            status: status,
            createDate: createdAt.getTime(),
            type: type
        });
        const data = await newClubFeatureChild.save();
        return { data: data, status: 0 };
    }

    async getClubFeatureChildBySlug(args: {
        parentId?: string;
        slug?: string
    }) {
        const { parentId, slug } = args;
        const data = await ClubFeatureChildModel.findOne({ slug: slug, parentId: parentId });
        if (data)
            return { data: data, status: 0 };
        return { data: null, status: 0 };
    }

    async deleteClubFeatureChild(args: {
        featureId?: string;
    }) {
        const { featureId } = args;
        const data = await ClubFeatureChildModel.findByIdAndDelete(featureId);
        if (data)
            return { data: data, status: 0 };
        return { data: null, status: -1 };
    }
}