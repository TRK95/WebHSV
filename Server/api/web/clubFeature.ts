import express from "express";
import asyncHandler from "../../utils/asyncHandler";
import ClubFeatureChildService from "../../services/clubFeatureChildService";
import ClubFeatureDetailService from "../../services/clubFeatureDetailService";
import ClubFeatureChild from "../../models/ClubFeatureChild";
import ClubFeatureDetail from "../../models/ClubFeatureDetail";

const Router = express.Router();
const clubFeatureChildService = new ClubFeatureChildService();
const clubFeatureDetailService = new ClubFeatureDetailService();

Router.post(
    "/clubFeatureChild/getClubFeatureChild",
    asyncHandler(async (req, res) => {
        const _parentId = req.query.parentId;
        const _status = req.query.status;

        const parentId = typeof _parentId !== "string" ? undefined : _parentId;
        const status = typeof _status !== "string" ? undefined : parseInt(_status);

        const result = await clubFeatureChildService.getClubFeatureChild({ parentId, status });
        return res.status(200).json(result);
    })
);

Router.post(
    "/clubFeatureChild/getClubFeatureChildByClubSlug",
    asyncHandler(async (req, res) => {
        const _slug = req.query.slug;
        const _status = req.query.status;

        const slug = typeof _slug !== "string" ? undefined : _slug;
        const status = typeof _status !== "string" ? undefined : parseInt(_status);

        const result = await clubFeatureChildService.getClubFeatureChildByClubSlug({ slug, status });
        return res.status(200).json(result);
    })
);

Router.post(
    "/clubFeatureChild/updateClubFeatureChild",
    asyncHandler(async (req, res) => {
        const { _id, title, shortDes, slug, parentId, status, createDate, lastUpdate, type } = <ClubFeatureChild>req.body;
        const result = await clubFeatureChildService.updateClubFeatureChild({
            _id,
            title,
            shortDes,
            slug,
            parentId,
            status,
            createDate,
            lastUpdate,
            type
        });
        return res.status(200).json(result);
    })
);

Router.get(
    "/clubFeatureChild/getClubFeatureChildBySlug",
    asyncHandler(async (req, res) => {
        const _slug = req.query.slug;
        const _parentId = req.query.parentId;

        const slug = typeof _slug !== "string" ? undefined : _slug;
        const parentId = typeof _parentId !== "string" ? undefined : _parentId;
        const result = await clubFeatureChildService.getClubFeatureChildBySlug({ parentId, slug });
        return res.status(200).json(result);
    })
);

Router.post(
    "/clubFeatureChild/deleteClubFeatureChild",
    asyncHandler(async (req, res) => {
        const _featureId = req.query.featureId;
        const featureId = typeof _featureId !== "string" ? undefined : _featureId;
        const result = await clubFeatureChildService.deleteClubFeatureChild({ featureId });
        return res.status(200).json(result);
    })
);

Router.post(
    "/clubFeatureDetail/getClubFeatureDetailByClubId",
    asyncHandler(async (req, res) => {
        const _limit = req.query.limit;
        const _offset = req.query.offset;
        const _clubId = req.query.clubId;
        const _status = req.query.status;

        const limit = typeof _limit !== "number" ? undefined : _limit;
        const offset = typeof _offset !== "number" ? undefined : _offset;
        const clubId = typeof _clubId !== "string" ? undefined : _clubId;
        const status = typeof _status !== "number" ? undefined : _status;

        const result = await clubFeatureDetailService.getClubFeatureDetailByClubId({ limit, offset, clubId, status });
        return res.status(200).json(result);
    })
);

Router.post(
    "/clubFeatureDetail/getClubFeatureDetailByFeatureId",
    asyncHandler(async (req, res) => {
        const _limit = req.query.limit;
        const _offset = req.query.offset;
        const _featureId = req.query.featureId;
        const _status = req.query.status;

        const limit = typeof _limit !== "string" ? undefined : +_limit;
        const offset = typeof _offset !== "string" ? undefined : +_offset;
        const featureId = typeof _featureId !== "string" ? undefined : _featureId;
        const status = typeof _status !== "string" ? undefined : +_status;

        const result = await clubFeatureDetailService.getClubFeatureDetailByFeatureId({ limit, offset, featureId, status });
        return res.status(200).json(result);
    })
);

Router.post(
    "/clubFeatureDetail/updateClubFeatureDetail",
    asyncHandler(async (req, res) => {
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
            lastUpdate,
            docUrl,
            fromDate,
            toDate,
            settingStatus,
            registerFromDate,
            registerToDate,
            memNum,
            contentType
        } = <ClubFeatureDetail>req.body;
        const result = await clubFeatureDetailService.updateClubFeatureDetail({
            _id,
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
            lastUpdate,
            docUrl,
            fromDate,
            toDate,
            settingStatus,
            registerFromDate,
            registerToDate,
            memNum,
            contentType
        });
        return res.status(200).json(result);
    })
);

Router.get(
    "/clubFeatureDetail/getClubFeatureDetailBySlug",
    asyncHandler(async (req, res) => {
        const _slug = req.query.slug;
        const _featureId = req.query.featureId;

        const slug = typeof _slug !== "string" ? undefined : _slug;
        const featureId = typeof _featureId !== "string" ? undefined : _featureId;
        const result = await clubFeatureDetailService.getClubFeatureDetailBySlug({ slug, featureId });
        return res.status(200).json(result);
    })
);

Router.post(
    "/clubFeatureDetail/joinClubFeature",
    asyncHandler(async (req, res) => {
        const _user = req.body;
        const _featureDetailId = req.query.featureDetailId;
        const _note = req.query.note;
        const _status = req.query.status;

        const user = _user?.user ? _user.user : null;
        const featureDetailId = typeof _featureDetailId !== "string" ? undefined : _featureDetailId;
        const note = typeof _note !== "string" ? undefined : _note;
        const status = typeof _status !== "string" ? undefined : +_status;

        const result = await clubFeatureDetailService.joinClubFeature({
            user,
            featureDetailId,
            note,
            status
        });
        return res.status(200).json(result);
    })
);

Router.post(
    "/clubFeatureDetail/approveClubFeature",
    asyncHandler(async (req, res) => {
        const _userId = req.query.userId;
        const _featureDetailId = req.query.featureDetailId;
        const _status = req.query.status;

        const userId = typeof _userId !== "string" ? undefined : _userId;
        const featureDetailId = typeof _featureDetailId !== "string" ? undefined : _featureDetailId;
        const status = typeof _status !== "string" ? undefined : +_status;

        const result = await clubFeatureDetailService.approveClubFeature({
            userId,
            featureDetailId,
            status,
        });
        return res.status(200).json(result);
    })
);

Router.post(
    "/clubFeatureDetail/getMemberFeatureDetail",
    asyncHandler(async (req, res) => {
        const _featureDetailId = req.query.featureDetailId;
        const _offset = req.query.offset;
        const _limit = req.query.limit;

        const featureDetailId = typeof _featureDetailId !== "string" ? undefined : _featureDetailId;
        const offset = typeof _offset !== "string" ? undefined : +_offset;
        const limit = typeof _limit !== "string" ? undefined : +_limit;

        const result = await clubFeatureDetailService.getMemberFeatureDetail({
            featureDetailId,
            offset,
            limit,
        });
        return res.status(200).json(result);
    })
);

Router.post(
    "/clubFeatureDetail/getMemberInfoFeatureDetail",
    asyncHandler(async (req, res) => {
        const _featureDetailId = req.query.featureDetailId;
        const _offset = req.query.offset;
        const _limit = req.query.limit;

        const featureDetailId = typeof _featureDetailId !== "string" ? undefined : _featureDetailId;
        const offset = typeof _offset !== "string" ? undefined : +_offset;
        const limit = typeof _limit !== "string" ? undefined : +_limit;

        const result = await clubFeatureDetailService.getMemberInfoFeatureDetail({
            featureDetailId,
            offset,
            limit,
        });
        return res.status(200).json(result);
    })
);

export { Router as clubFeatureRouter };