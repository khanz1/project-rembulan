import { NextFunction, Request, Response } from 'express';
import logger from '../helpers/logger';

export const logging = (req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.path}`);
  next();
};
