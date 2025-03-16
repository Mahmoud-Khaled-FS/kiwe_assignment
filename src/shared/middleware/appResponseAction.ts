import { NextFunction, Request, RequestHandler, Response } from 'express';
import { Responseable } from '../../types/response';

/**
 *  this middleware is used to set the appRes function to the response object
 */
export function appResponseHandlerMiddleware(): RequestHandler {
  return (_: Request, res: Response, next: NextFunction) => {
    function appRes(response: Responseable) {
      res.status(response.statusCode()).json(response.toJson());
    }
    res.appRes = appRes;
    next();
  };
}
