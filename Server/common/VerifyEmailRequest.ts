import { Request } from 'express';
import { VerifyEmailTokenData } from './TokenData';

export default interface VerifyEmailRequest extends Request {
  credentials?: VerifyEmailTokenData;
}