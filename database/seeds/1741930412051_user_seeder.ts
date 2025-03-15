import bcrypt from 'bcrypt';
import type { Kysely } from 'kysely';
import { Database } from '../../src/types/database';

export async function seed(db: Kysely<Database>): Promise<void> {
  const count = await db
    .selectFrom('users')
    .select(({ fn }) => [fn.count<number>('id').as('count')])
    .executeTakeFirst();
  if (count && count.count > 0) {
    console.log('users already seeded');
    return;
  }
  const passwordHash = bcrypt.hashSync('password', 10);
  await db
    .insertInto('users')
    .values([
      {
        email: 'user@example.com',
        name: 'User',
        password_hash: passwordHash,
      },
    ])
    .execute();
}
