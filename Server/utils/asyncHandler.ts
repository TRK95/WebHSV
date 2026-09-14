import { Request, Response, NextFunction, RequestHandler } from 'express';

// eslint-disable-next-line no-unused-vars
type AsyncRequestHandler = (req: Request, res: Response, next?: NextFunction) => Promise<any>;

export default (fn: AsyncRequestHandler): RequestHandler =>
  ((req: Request, res: Response, next: NextFunction) => fn(req, res, next).catch(next));
