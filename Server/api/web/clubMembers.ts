import express from "express";
import multer from "multer";
import ClubMemberService from "../../services/clubMemberService";
import asyncHandler from "../../utils/asyncHandler";
import ClubMember from "../../models/ClubMember";
import { UserInfoI } from "../../models/UserInfo";

const Router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const clubMemberService = new ClubMemberService();

Router.post(
    "/club/getMemberClubs",
    asyncHandler(async (req, res) => {
        const _clubId = req.query.clubId;
        const _limit = req.query?.limit;
        const _offset = req.query?.offset;

        const clubId = typeof _clubId !== "string" ? undefined : _clubId;
        const limit = typeof _limit === "string" ? parseInt(_limit) : undefined;
        const offset = typeof _offset === "string" ? parseInt(_offset) : undefined;

        const result = await clubMemberService.getMemberClubs({ limit, offset, clubId });
        return res.status(200).json(result);
    })
);

Router.get(
    "/club/getClubPresident",
    asyncHandler(async (req, res) => {
        const _clubId = req.query.clubId;
        const clubId = typeof _clubId !== "string" ? undefined : _clubId;

        const result = await clubMemberService.getClubPresident({ clubId });
        return res.status(200).json(result);
    })
);

Router.post(
    "/club/approveClub",
    asyncHandler(async (req, res) => {
        const _userId = req.query.userId;
        const _clubId = req.query.clubId;
        const _status = req.query.status;

        const userId = typeof _userId !== "string" ? undefined : _userId;
        const clubId = typeof _clubId !== "string" ? undefined : _clubId;
        const status = typeof _status !== "string" ? undefined : +_status;

        const result = await clubMemberService.approveClub({
            userId,
            clubId,
            status,
        });
        return res.status(200).json(result);
    })
);

Router.post(
    "/club/setPresidentClub",
    asyncHandler(async (req, res) => {
        const _user = req.body;
        const _clubId = req.query.clubId;

        const user = _user?.user ? _user.user : null;
        const clubId = typeof _clubId !== "string" ? undefined : _clubId;

        const result = await clubMemberService.setPresidentClub({
            user,
            clubId,
        });
        return res.status(200).json(result);
    })
);

Router.post(
    "/club/joinClub",
    asyncHandler(async (req, res) => {
        const _user = req.body;
        const _clubId = req.query.clubId;

        const user = _user?.user ? _user.user : null;
        const clubId = typeof _clubId !== "string" ? undefined : _clubId;

        const result = await clubMemberService.joinClub({
            user,
            clubId,
        });
        return res.status(200).json(result);
    })
);

Router.post(
    "/club/uploadMembers", upload.single('file'),
    asyncHandler(async (req, res) => {
        const _clubId = req.query.clubId;
        const file = req.file;
        if (!file) {
            return res.status(400).json({ status: 'error', message: 'No file uploaded' });
        }

        const clubId = typeof _clubId !== "string" ? undefined : _clubId;
        const result = await clubMemberService.uploadMembers({ buffer: file.buffer, clubId });
        return res.status(200).json(result);
    })
);

Router.post(
    "/club/updateRole",
    asyncHandler(async (req, res) => {
        const _userId = req.query.userId;
        const _clubId = req.query.clubId;
        const _role = req.query.role;

        const userId = typeof _userId !== "string" ? undefined : _userId;
        const clubId = typeof _clubId !== "string" ? undefined : _clubId;
        const role = typeof _role !== "string" ? undefined : +_role;

        const result = await clubMemberService.updateRole({
            userId,
            clubId,
            role
        });
        return res.status(200).json(result);
    })
);

export { Router as clubMemberRouter };