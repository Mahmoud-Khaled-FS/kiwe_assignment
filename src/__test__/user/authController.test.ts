import AuthController from '../../features/auth/controllers/auth.controller';
import AuthService from '../../features/auth/services/auth.service';
import { Request, Response } from 'express';
import { AuthUser } from '../../features/auth/types';
import AppResponse from '../../shared/utils/appResponse';
import AppError from '../../shared/utils/appError';
import { HttpStatus } from '../../shared/utils/statusCode';

jest.mock('../../features/auth/services/auth.service');

describe('Auth Controller', () => {
  let authController: AuthController;
  let authService: jest.Mocked<AuthService>;
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    // @ts-ignore
    authService = new AuthService() as jest.Mocked<AuthService>;
    authController = new AuthController(authService);

    req = {
      body: { email: 'test@example.com', password: 'password123' },
    };

    res = {
      appRes: jest.fn(),
    };
  });

  it('should log in a user and return a token', async () => {
    const mockUser: AuthUser = {
      user: {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        created_at: new Date(),
        updated_at: new Date(),
      },
      token: 'mockToken',
    };
    authService.login.mockResolvedValue(mockUser);

    await authController.login(req as Request, res as Response);

    expect(res.appRes).toHaveBeenCalledWith(expect.any(AppResponse));
    const responseData = (res.appRes as jest.Mock).mock.calls[0][0].data;
    expect(responseData.token).toBe('mockToken');
    expect(responseData.email).toBe(mockUser.user.email);
  });

  it('should return 401 for invalid credentials', async () => {
    authService.login.mockRejectedValue(new AppError('Invalid credentials', HttpStatus.Unauthorized));

    await expect(authController.login(req as Request, res as Response)).rejects.toThrow('Invalid credentials');
  });
});
