import { injectable } from 'inversify';
import { IUserService } from './userServiceInterface';
import { User } from '../models/user';
import UserRepository from '../repositories/userRepository';

@injectable()
class UserService implements IUserService {
  constructor(private readonly userRepository: UserRepository) {}
  async getByEmail(email: string): Promise<User | null> {
    return await this.userRepository.getByEmail(email);
  }
}

export default UserService;
