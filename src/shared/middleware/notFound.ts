import { Request, Response } from 'express';
import AppError from '../utils/appError';
import { HttpStatus } from '../utils/statusCode';

function notFoundHandler() {
  return (_: Request, res: Response) => {
    res.appRes(new AppError('Invalid Path', HttpStatus.NotFound));
  };
}

export default notFoundHandler;
