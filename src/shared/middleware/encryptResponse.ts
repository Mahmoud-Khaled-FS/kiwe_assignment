import { NextFunction, Request, RequestHandler, Response } from 'express';
import { Encryption } from '../utils/encryption/encryption';
import AppError from '../utils/appError';

/**
 * this middleware encrypt response data and override the send function
 * @param encryption
 * @returns
 */
export function encryptResponseMiddleware(encryption: Encryption): RequestHandler {
  return function (req: Request, res: Response, next: NextFunction) {
    const sendFn = res.send.bind(res);
    res.send = function (data) {
      if (res.headersSent || res.getHeader('X-Encrypted')) {
        return sendFn(data);
      }
      if (!data) {
        return sendFn.call(this, data);
      }
      try {
        res.setHeader('X-Encrypted', 'true');
        res.setHeader('X-Encrypted-Type', encryption.name());
        const encryptedData = encryption.encrypt(
          JSON.stringify(data),
          req.headers['x-encryption-key'] as string | undefined,
        );
        const response = {
          data: encryptedData,
          type: encryption.name(),
          statusCode: res.statusCode,
        };
        return sendFn(JSON.stringify(response));
      } catch (error) {
        throw AppError._500(error as Error);
      }
    };
    next();
  };
}
