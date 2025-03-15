import { NextFunction, Request, RequestHandler, Response } from 'express';
import { Responseable } from '../../types/response';

export function appResponseHandlerMiddleware(): RequestHandler {
  return (_: Request, res: Response, next: NextFunction) => {
    function appRes(response: Responseable) {
      res.status(response.statusCode()).json(response.toJson());
    }
    res.appRes = appRes;
    next();
  };
}
