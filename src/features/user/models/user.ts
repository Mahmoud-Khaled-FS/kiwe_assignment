import { Generated, Selectable } from 'kysely';

export type UserTable = {
  id: Generated<number>;
  name: string;
  email: string;
  password_hash: string;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
};

export type User = Selectable<UserTable>;
