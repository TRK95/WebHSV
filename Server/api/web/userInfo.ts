import express from "express";
import asyncHandler from "../../utils/asyncHandler";
import UserInfoService from "../../services/userInfoService";
import UserInfo, { UserInfoI } from "../../models/UserInfo";

const Router = express.Router();
const userInfoService = new UserInfoService();

Router.post("/userInfos/getUserInfoByDate", asyncHandler(async (req, res) => {
    const reqBody = <{ status: number, numberDaysAgo: number, limit: number, offset: number, type?: number }>req.body;
    const result = await userInfoService.getUserInfoByDate(reqBody);
    return res.status(200).json(result);
}));

// Router.post("/userInfos/createUserInfo", asyncHandler(async (req, res) => {
//     const reqBody: UserInfoI = req.body;
//     const dataRes = await userInfoService.getUserInfoByUserId({
//         userId: reqBody?.userId || ""
//     });

//     if ((reqBody?.type as number >= 0) && (reqBody?.type !== dataRes?.data?.type)) {
//         if (dataRes?.data?.userId) {
//             const result = await userInfoService.updateUserInfo({
//                 userId: reqBody?.userId || "",
//                 type: reqBody?.type,
//             });
//             return res.status(200).json(result);
//         }
//         const result = await userInfoService.createNewUserInfo(reqBody);
//         return res.status(200).json(result);
//     }

//     if (dataRes?.data?.userId) {
//         return res.status(200).json({
//             data: null,
//             status: 1
//         });
//     }
//     const result = await userInfoService.createNewUserInfo(reqBody);
//     return res.status(200).json(result);
// }));

Router.post("/userInfos/createUserInfo", asyncHandler(async (req, res) => {
    const reqBody: UserInfoI = req.body;
    const result = await userInfoService.createNewUserInfo(reqBody);
    res.status(200).json(result);
}));

Router.post("/userInfos/getUserInfoById", asyncHandler(async (req, res) => {
    const reqBody = <{ id: string }>req.body;
    const result = await userInfoService.getUserInfoById(reqBody);
    return res.status(200).json(result);
}));

Router.post("/userInfos/getUserInfoByUserId", asyncHandler(async (req, res) => {
    const reqBody = <{ userId: string }>req.body;
    const result = await userInfoService.getUserInfoByUserId(reqBody);
    return res.status(200).json(result);
}));

Router.post("/userInfos/getUserInfoByUserName", asyncHandler(async (req, res) => {
    const reqBody = <{ name: string }>req.body;
    const result = await userInfoService.getUserInfoByUserName(reqBody);
    return res.status(200).json(result);
}));

Router.post("/userInfos/getUserInfoByEmail", asyncHandler(async (req, res) => {
    const reqBody = <{ email: string, userId?: string }>req.body;
    const result = await userInfoService.getUserInfoByEmail(reqBody);
    return res.status(200).json(result);
}));

Router.post("/userInfos/updateUserInfo", asyncHandler(async (req, res) => {
    const {
        _id,
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
        lastCheckin,
    } = <UserInfo>req.body;
    const result = await userInfoService.updateUserInfo({
        _id,
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
        lastCheckin,
    });
    return res.status(200).json(result);
}));

Router.post("/userInfos/deleteUserInfo", asyncHandler(async (req, res) => {
    const _userId = req.query.userId;

    const userId = typeof _userId !== "string" ? undefined : _userId;
    const result = await userInfoService.deleteUserInfo({ userId });
    return res.status(200).json(result);
}));

Router.post("/userInfos/getUserInfoByUserIds", asyncHandler(async (req, res) => {
    const reqBody = <{ userIds: string[] }>req.body;
    const result = await userInfoService.getUserInfoByUserIds(reqBody);
    return res.status(200).json(result);
}));

Router.post("/userInfos/signInCms", asyncHandler(async (req, res) => {
    const reqBody = <{ email: string, password: string }>req.body;
    const result = await userInfoService.checkPresidentSignIn(reqBody);
    return res.status(200).json(result);
}));

Router.post("/userInfos/authorizeByToken", asyncHandler(async (req, res) => {
    const reqBody = <{ token: string }>req.body;
    const result = await userInfoService.authorizeByToken(reqBody);
    return res.status(200).json(result);
}));

Router.post("/userInfos/signInMember", asyncHandler(async (req, res) => {
    const reqBody = <{ email: string, password: string }>req.body;
    const result = await userInfoService.checkMemberSignIn(reqBody);
    return res.status(200).json(result);
}));

Router.post("/userInfos/changePassword", asyncHandler(async (req, res) => {
    const _userId = req.query.userId;
    const _oldPassword = req.query.oldPassword;
    const _newPassword = req.query.newPassword;

    const userId = typeof _userId !== "string" ? undefined : _userId;
    const oldPassword = typeof _oldPassword !== "string" ? undefined : _oldPassword;
    const newPassword = typeof _newPassword !== "string" ? undefined : _newPassword;
    const result = await userInfoService.changePassword({ userId, oldPassword, newPassword });
    return res.status(200).json(result);
}));

export { Router as userInfoRouters };
