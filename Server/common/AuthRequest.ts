import { Request } from 'express';
import { TokenData } from './TokenData';

export default interface AuthRequest extends Request {
  credentials?: TokenData;
}