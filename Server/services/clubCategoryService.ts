import { ClubCategoryModel } from "../database/mongo/ClubCategory";
import ClubCategory from "../models/ClubCategory";

export default class ClubCategoryService {
    async getCategory(args: {
        type?: number;
        parentId?: string;
        status?: number
    }) {
        const { type, status, parentId } = args;
        if (parentId === "-1" || parentId === "0" || parentId === undefined) {
            const clubCategory = await ClubCategoryModel.find({
                status: status,
                type: type,
                parentId: undefined,
            });
            const total = await (await ClubCategoryModel.find({ type: type, status: status, parentId: undefined })).length;

            const result = {
                data: clubCategory,
                total: total,
                status: 0,
            };
            return result;
        }

        const clubCategory = await ClubCategoryModel.find({
            status: status,
            type: type,
            parentId: parentId,
        });
        const total = await ClubCategoryModel.find({ type: type, status: status, parentId: parentId }).countDocuments();

        const result = {
            data: clubCategory,
            total: total,
            status: 0,
        };
        return result;
    }

    async updateCategory(args: ClubCategory) {
        const { _id, index, name, des, slug, status, createDate, clubNum, type, avatar, parentId } = args;
        if (_id) {
            const updateClubCategory = await ClubCategoryModel.findByIdAndUpdate(
                _id,
                {
                    index: index,
                    name: name,
                    des: des,
                    slug: slug,
                    status: status,
                    createDate: createDate,
                    clubNum: clubNum,
                    type: type,
                    avatar: avatar,
                    parentId: parentId
                },
                {
                    new: true,
                }
            );
            const result = {
                data: updateClubCategory,
                status: 0,
            };

            return result;
        }
        const createdAt = new Date();
        const newClubCategory = new ClubCategoryModel({
            index: index,
            name: name,
            des: des,
            slug: slug,
            status: status,
            createDate: createdAt.getTime(),
            clubNum: clubNum,
            type: type,
            avatar: avatar,
            parentId: parentId
        });
        const data = await newClubCategory.save();

        const result = {
            data: data,
            status: 0,
        };
        return result;
    }

    async getClubCategoryBySlug(args: { slug?: string }) {
        const { slug } = args;

        const clubCategory = await ClubCategoryModel.findOne({ slug: slug });

        if (clubCategory) {
            const result = {
                data: clubCategory,
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
}