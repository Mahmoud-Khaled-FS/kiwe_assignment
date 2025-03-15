import AuthService from '../../features/auth/services/auth.service';
import { User } from '../../features/user/models/user';
import UserService from '../../features/user/services/user.service';
import bcrypt from 'bcrypt';

jest.mock('../../features/user/services/user.service');

describe('AuthService', () => {
  let authService: AuthService;
  let userService: jest.Mocked<UserService>;

  beforeEach(() => {
    // @ts-ignore
    userService = new UserService() as jest.Mocked<UserService>;
    authService = new AuthService(userService);
  });

  it('should log in a user with correct credentials', async () => {
    const mockUser: User = {
      id: 1,
      email: 'test@example.com',
      password_hash: bcrypt.hashSync('password', 10),
      name: 'Test User',
      created_at: new Date(),
      updated_at: new Date(),
    };

    userService.getByEmail.mockResolvedValue(mockUser);

    const result = await authService.login({ email: 'test@example.com', password: 'password' });

    expect(result.user).toEqual(mockUser);
    expect(result.token).toBeDefined();
  });

  it('should throw an error if user is not found', async () => {
    userService.getByEmail.mockResolvedValue(null);

    await expect(authService.login({ email: 'notfound@example.com', password: 'password123' })).rejects.toThrow(
      'Invalid credentials',
    );
  });
});
