import { Router } from 'express';
import AuthController from '../controllers/auth.controller';
import AuthService from '../services/auth.service';
import UserService from '../../user/services/user.service';
import UserRepository from '../../user/repositories/userRepository';

export function authApi(): Router {
  const authService = new AuthService(new UserService(new UserRepository()));
  const authController = new AuthController(authService);
  const router = Router();
  router.post('/login', authController.login);

  return router;
}
