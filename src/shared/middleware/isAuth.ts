import { NextFunction, Request, Response } from 'express';
import AuthService from '../../features/auth/services/auth.service';
import { HttpStatus } from '../utils/statusCode';
import AppError from '../utils/appError';

function isAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    res.appRes(new AppError('Unauthorized', HttpStatus.Unauthorized));
    return;
  }
  const token = authHeader.split(' ')[1];
  if (!token) {
    res.status(HttpStatus.Unauthorized).json({ message: 'Unauthorized' });
    return;
  }

  const user = AuthService.verifyToken(token);
  req.userId = user.id;
  next();
}

export default isAuth;
