import { Response } from 'express';
import AuthRequest from '../../common/AuthRequest';
import { UnauthorizedError } from '../../common/errors';
import { TokenData } from '../../common/TokenData';
import VerifyEmailRequest from '../../common/VerifyEmailRequest';
import UserService from '../../services/userService';
import { jwtDecodeToken, jwtVerifyRegisterToken } from '../../utils';
import asyncHandler from '../../utils/asyncHandler';
const userService = new UserService();

export const verifyToken = asyncHandler(async (req: AuthRequest, res: Response, next) => {
  const token = req.body.token || req.cookies['token']; // TODO: implement request with cookie only
  if (!token) throw new UnauthorizedError();
  const userInfo = jwtDecodeToken(token) as TokenData;
  if (!userInfo || !userInfo._id) throw new UnauthorizedError('token is invalid');

  const userToken = await userService.getUserTokenFromCache(userInfo._id);
  if (!userToken || userToken !== token) throw new UnauthorizedError('token is invalid');

  req.credentials = userInfo;
  return next!();
});

export const verifyRegisterToken = asyncHandler(async (req: VerifyEmailRequest, res, next) => {
  const token = req.params.token;
  if (!token) throw new UnauthorizedError();
  const user = jwtVerifyRegisterToken(token);
  if (!user) throw new UnauthorizedError('token is invalid');

  const currentToken = await userService.getUserTokenFromCache(`verify_${user._id}`);
  if (!currentToken || currentToken !== token) throw new UnauthorizedError('token is invalid');

  req.credentials = user;
  return next!();
});

export const verifyToken2 = async (token: string): Promise<string | null> => {
  try {
    if (!token) return null;
    const userInfo = jwtDecodeToken(token) as TokenData;
    if (!userInfo || !userInfo._id) return null;

    const userToken = await userService.getUserTokenFromCache(userInfo._id);
    if (!userToken || userToken !== token) return null;
    return userInfo._id;
  } catch (error) {
    return null;
  }
};

export const assignTokenLogout = asyncHandler(async (req: AuthRequest, res, next) => {
  const token = req.body.token || req.cookies['token']; // TODO: implement request with cookie only
  if (!token) throw new UnauthorizedError();
  const userInfo = jwtDecodeToken(token) as TokenData;
  req.credentials = userInfo;
  return next!();
});
