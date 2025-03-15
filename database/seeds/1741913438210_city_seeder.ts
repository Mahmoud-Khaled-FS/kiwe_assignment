import { readFileSync } from 'node:fs';
import type { Kysely } from 'kysely';
import { Database } from '../../src/types/database';
import { join } from 'node:path';

const CHUNK_SIZE = 1000;

export async function seed(db: Kysely<Database>): Promise<void> {
  const count = await db
    .selectFrom('cities')
    .select(({ fn }) => [fn.count<number>('cities.id').as('count')])
    .executeTakeFirst();

  if (count && count.count > 0) {
    console.log('cities already seeded');
    return;
  }
  const rawData = readFileSync(join('data', 'city.list.json'), 'utf-8');
  const cities = JSON.parse(rawData);
  let i = 0;
  while (i < cities.length) {
    const chunk = cities.slice(i, i + CHUNK_SIZE);
    try {
      await db
        .insertInto('cities')
        .values(
          chunk.map((c) => ({
            name: c.name,
            country_code: c.country,
            latitude: c.coord.lat,
            longitude: c.coord.lon,
            open_weather_id: c.id,
          })),
        )
        .execute();
    } catch (err) {
      console.log(err);
    }
    console.log(
      `Inserted chunk ${Math.floor(i / CHUNK_SIZE) + 1} (${i + 1} - ${Math.min(i + CHUNK_SIZE, cities.length)})`,
    );
    i += CHUNK_SIZE;
  }
}
