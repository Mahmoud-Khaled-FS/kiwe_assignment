import { User } from '../models/user';

export interface IUserService {
  getByEmail: (email: string) => Promise<User | null>;
}
