import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import AppError from '../../../shared/utils/appError';
import { HttpStatus } from '../../../shared/utils/statusCode';
import UserService from '../../user/services/user.service';
import Config from '../../../config';
import { User } from '../../user/models/user';
import { AuthUser } from '../types';
import { Id } from '../../../types/database';

class AuthService {
  constructor(private readonly userService: UserService) {}

  public async login(credentials: { email: string; password: string }): Promise<AuthUser> {
    const user = await this.userService.getByEmail(credentials.email);
    if (!user) {
      throw new AppError('Invalid credentials', HttpStatus.Unauthorized);
    }
    const isValidPassword = await this.comparePassword(user.password_hash, credentials.password);
    if (!isValidPassword) {
      throw new AppError('Invalid credentials', HttpStatus.Unauthorized);
    }
    const token = this.createToken(user);
    return { user, token };
  }

  private async comparePassword(hashedPassword: string, password: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  private createToken(user: User): string {
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      Config.TOKEN_PUBLIC,
      {
        expiresIn: '1d',
      },
    );
    return token;
  }

  public static verifyToken(token: string): { id: Id } {
    try {
      const decodedToken = jwt.verify(token, Config.TOKEN_PUBLIC) as { id: Id };
      return { id: decodedToken.id };
    } catch {
      throw new AppError('Invalid token', HttpStatus.Unauthorized);
    }
  }
}

export default AuthService;
