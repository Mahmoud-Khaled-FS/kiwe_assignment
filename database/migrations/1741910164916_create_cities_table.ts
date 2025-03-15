import { sql, type Kysely } from 'kysely';
import { Database } from '../../src/types/database';

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function up(db: Kysely<Database>): Promise<void> {
  await sql`CREATE EXTENSION IF NOT EXISTS pg_trgm`.execute(db);

  await db.schema
    .createTable('cities')
    .addColumn('id', 'serial', (c) => c.primaryKey())
    .addColumn('name', 'varchar', (c) => c.notNull())
    .addColumn('country_code', 'varchar', (c) => c.notNull())
    .addColumn('longitude', 'decimal', (c) => c.notNull())
    .addColumn('latitude', 'decimal', (c) => c.notNull())
    .addColumn('open_weather_id', 'integer')
    .execute();
  await db.schema
    .createIndex('idx_city_name')
    .on('cities')
    .using('gin')
    .expression(sql`name gin_trgm_ops`)
    .execute();
  await db.schema.createIndex('idx_country_code').on('cities').column('country_code').execute();
}

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function down(db: Kysely<Database>): Promise<void> {
  await db.schema.dropTable('cities').execute();
}
