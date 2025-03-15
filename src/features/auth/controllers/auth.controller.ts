import { Request, Response } from 'express';
import { asyncMethod } from '../../../shared/decorators/asyncHandler.decorator';
import { Validate } from '../../../shared/decorators/validation.decorator';
import { loginSchema } from '../validation/login.rule';
import AuthService from '../services/auth.service';
import AppResponse from '../../../shared/utils/appResponse';
import { AuthUserResponse } from '../types';

class AuthController {
  constructor(public readonly authService: AuthService) {
    this.login = this.login.bind(this);
  }

  @asyncMethod
  @Validate(loginSchema)
  async login(req: Request, res: Response) {
    const payload: loginSchema = req.body;
    const { user, token } = await this.authService.login(payload);
    const response: AuthUserResponse = {
      id: user.id,
      email: user.email,
      name: user.name,
      created_at: user.created_at,
      updated_at: user.updated_at,
      token,
    };
    res.appRes(new AppResponse(response));
  }
}

export default AuthController;
