import { type Kysely } from 'kysely';
import { Database } from '../../src/types/database';

export async function up(db: Kysely<Database>): Promise<void> {
  await db.schema
    .createTable('favorite_cities')
    .addColumn('user_id', 'integer', (col) => col.notNull().references('users.id').onDelete('cascade'))
    .addColumn('city_id', 'integer', (col) => col.notNull().references('cities.id').onDelete('cascade'))
    .addPrimaryKeyConstraint('favorite_cities_pk', ['user_id', 'city_id'])
    .execute();
}

export async function down(db: Kysely<Database>): Promise<void> {
  await db.schema.dropTable('favorite_cities').execute();
}
