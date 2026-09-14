import { Request, Response, NextFunction } from "express";
import { FailureError, ServerError, UnauthorizedError } from "../../common/errors";
import logger from "../../utils/logger";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err) {
    if (err instanceof ServerError) {
      if (err instanceof UnauthorizedError) {
        res.clearCookie('token');
        return res.status(err.status).json({ message: err.message, data: err.data });
      }
      return res.status(err.status).json({ message: err.message, data: err.data });
    }
    if (err instanceof FailureError) {
      return res.status(400).json({ message: err.message });
    }
    logger.error(`from ${req.method} ${req.originalUrl} - `, err.message, err.stack);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
  return next();
};

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.method} ${req.url} Not Found`
  });
  return next();
};
