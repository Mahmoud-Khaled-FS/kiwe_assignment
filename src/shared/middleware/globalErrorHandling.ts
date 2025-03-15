import { NextFunction, Request, Response } from 'express';
import AppError from '../utils/appError';

function globalErrorHandling(err: Error, _: Request, res: Response, __: NextFunction) {
  if (err instanceof AppError) {
    return res.appRes(err);
  }
  return res.appRes(AppError._500(err));
}

export default globalErrorHandling;
