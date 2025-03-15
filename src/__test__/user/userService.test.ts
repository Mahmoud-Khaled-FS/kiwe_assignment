import { User } from '../../features/user/models/user';
import UserRepository from '../../features/user/repositories/userRepository';
import UserService from '../../features/user/services/user.service';

jest.mock('../../features/user/repositories/userRepository');

describe('UserService', () => {
  let userService: UserService;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    userRepository = new UserRepository() as jest.Mocked<UserRepository>;
    userService = new UserService(userRepository);
  });

  it('should return a user by email', async () => {
    const mockUser: User = {
      id: 1,
      email: 'test@example.com',
      password_hash: 'hashedPassword',
      name: 'Test User',
      created_at: new Date(),
      updated_at: new Date(),
    };

    userRepository.getByEmail.mockResolvedValue(mockUser);

    const result = await userService.getByEmail('test@example.com');

    expect(result).toEqual(mockUser);
  });

  it('should return null if user does not exist', async () => {
    userRepository.getByEmail.mockResolvedValue(null);

    const result = await userService.getByEmail('notfound@example.com');

    expect(result).toBeNull();
  });
});
