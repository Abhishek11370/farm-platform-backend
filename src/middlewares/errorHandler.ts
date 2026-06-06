import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export interface CustomError extends Error {
  statusCode?: number;
  details?: any;
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  logger.error(`${req.method} ${req.url} - Error: ${message}`, err.stack, err.details);

  return res.status(statusCode).json({
    data: null,
    meta: null,
    error: {
      code: err.name || 'INTERNAL_SERVER_ERROR',
      message,
      details: err.details || null
    }
  });
};
