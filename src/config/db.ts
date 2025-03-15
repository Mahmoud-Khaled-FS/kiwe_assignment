import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { Config } from './env';
import { Database } from '../types/database';

export const pool = new Pool({
  database: Config.DB_NAME,
  host: Config.DB_HOST,
  user: Config.DB_USER,
  port: Config.DB_PORT,
  password: Config.DB_PASSWORD,
});

const dialect = new PostgresDialect({ pool });

export const db = new Kysely<Database>({ dialect });
