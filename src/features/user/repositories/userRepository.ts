import { db } from '../../../config/db';
import { User } from '../models/user';

class UserRepository {
  public async getByEmail(email: string): Promise<User | null> {
    const user = await db.selectFrom('users').selectAll().where('email', '=', email).executeTakeFirst();
    return user || null;
  }
}

export default UserRepository;
