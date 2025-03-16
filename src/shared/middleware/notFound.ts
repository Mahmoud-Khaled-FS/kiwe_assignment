import { Request, Response } from 'express';
import AppError from '../utils/appError';
import { HttpStatus } from '../utils/statusCode';

/**
 * throw not found error 404
 */
function notFoundHandler() {
  return (_: Request, res: Response) => {
    res.appRes(new AppError('Invalid Path', HttpStatus.NotFound));
  };
}

export default notFoundHandler;
