import 'dotenv/config';
import { PostgresDialect } from 'kysely';
import { defineConfig } from 'kysely-ctl';
import { Pool } from 'pg';
import Config from './src/config';

const dialect = new PostgresDialect({
  pool: new Pool({
    database: Config.DB_NAME,
    host: Config.DB_HOST,
    user: Config.DB_USER,
    port: Config.DB_PORT,
    password: Config.DB_PASSWORD,
  }),
});

export default defineConfig({
  dialect,
  migrations: {
    migrationFolder: './database/migrations',
    allowJS: false,
  },
  seeds: {
    seedFolder: './database/seeds',
  },
});
