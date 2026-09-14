import express from "express";
import ClubService from "../../services/clubService";
import asyncHandler from "../../utils/asyncHandler";
import Club from "../../models/Club";

const Router = express.Router();
const clubService = new ClubService();

Router.post(
    "/club/getClubsByDate",
    asyncHandler(async (req, res) => {
        const _limit = req.query?.limit;
        const _offset = req.query?.offset;
        const _type = req.query?.type;
        const _status = req.query?.status;

        const limit = typeof _limit === "string" ? parseInt(_limit) : undefined;
        const offset = typeof _offset === "string" ? parseInt(_offset) : undefined;
        const type = typeof _type === "string" ? parseInt(_type) : undefined;
        const status = typeof _status === "string" ? parseInt(_status) : undefined;

        const result = await clubService.getClubsByType({
            limit,
            offset,
            type,
            status
        });

        return res.status(200).json(result);
    })
);

Router.post(
    "/club/getClubsByParentId",
    asyncHandler(async (req, res) => {
        const _categoryId = req.query.categoryId;
        const _status = req.query.status;

        const categoryId = typeof _categoryId === "string" ? _categoryId : undefined;
        const status = typeof _status !== "string" ? undefined : +_status;

        const result = await clubService.getClubsByCategory({
            categoryId,
            status
        });

        return res.status(200).json(result);
    })
);

Router.get(
    "/club/getClubBySlug",
    asyncHandler(async (req, res) => {
        const _slug = req.query.slug;

        const slug = typeof _slug !== "string" ? undefined : _slug;
        const result = await clubService.getClubsBySlug({ slug });
        return res.status(200).json(result);
    })
);

Router.get(
    "/club/getClubsByPresidentId",
    asyncHandler(async (req, res) => {
        const _presidentId = req.query.presidentId;

        const presidentId = typeof _presidentId !== "string" ? undefined : _presidentId;
        const result = await clubService.getClubsByPresidentId({ presidentId });
        return res.status(200).json(result);
    })
);

Router.get(
    "/club/getClubById",
    asyncHandler(async (req, res) => {
        const _clubId = req.query.clubId;
        const clubId = typeof _clubId !== "string" ? undefined : _clubId;
        const result = await clubService.getClubsById({ clubId });
        return res.status(200).json(result);
    })
);

Router.get(
    "/club/getClubByName",
    asyncHandler(async (req, res) => {
        const _name = req.query.name;

        const name = typeof _name !== "string" ? undefined : _name;
        const result = await clubService.getClubsByName({ name });
        return res.status(200).json(result);
    })
);

Router.post(
    "/club/getMyClubs",
    asyncHandler(async (req, res) => {
        const _userId = req.query.userId;
        const _status = req.query.status;

        const userId = typeof _userId !== "string" ? undefined : _userId;
        const status = typeof _status !== "string" ? undefined : +_status;
        const result = await clubService.getUserClub({ userId, status });
        return res.status(200).json(result);
    })
);

Router.post(
    "/club/updateClub",
    asyncHandler(async (req, res) => {
        const { _id,
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
            memNum,
            avatar,
            showMem,
            settingStatus,
            president,
            presidentId,
            contactInfo
        } = <Club>req.body;

        const result = await clubService.updateClub({
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
            memNum,
            avatar,
            showMem,
            settingStatus,
            president,
            presidentId,
            contactInfo
        });

        return res.status(200).json(result);
    })
);

export { Router as clubRouter };