import express from "express";
import ClubCategoryService from "../../services/clubCategoryService";
import asyncHandler from "../../utils/asyncHandler";
import ClubCategory from "../../models/ClubCategory";

const Router = express.Router();
const clubCategoryService = new ClubCategoryService();

Router.post(
    "/club/getClubsCategory",
    asyncHandler(async (req, res) => {
        const _type = req.query.type;
        const _parentId = req.query?.parentId;
        const _status = req.query.status;

        const type = typeof _type === "string" ? parseInt(_type) : undefined;
        const parentId = typeof _parentId === "string" ? _parentId : undefined;
        const status = typeof _status === "string" ? parseInt(_status) : undefined;

        const result = await clubCategoryService.getCategory({
            type, parentId, status
        });

        return res.status(200).json(result);
    })
);

Router.post(
    "/club/updateClubCategory",
    asyncHandler(async (req, res) => {
        const {
            _id,
            index,
            name,
            des,
            slug,
            status,
            createDate,
            clubNum,
            type,
            avatar,
            parentId
        } = <ClubCategory>req.body;

        const result = await clubCategoryService.updateCategory({
            _id,
            index,
            name,
            des,
            slug,
            status,
            createDate,
            clubNum,
            type,
            avatar,
            parentId
        });

        return res.status(200).json(result);
    })
);

Router.get(
    "/club/getClubCategoryBySlug",
    asyncHandler(async (req, res) => {
        const _slug = req.query.slug;

        const slug = typeof _slug !== "string" ? undefined : _slug;
        const result = await clubCategoryService.getClubCategoryBySlug({ slug });
        return res.status(200).json(result);
    })
);

export { Router as clubCategoryRouter };