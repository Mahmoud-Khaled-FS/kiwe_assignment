import { User } from '../../user/models/user';

export type AuthUser = {
  user: Omit<User, 'password_hash'>;
  token: string;
};

export type AuthUserResponse = Omit<User, 'password_hash'> & { token: string };
