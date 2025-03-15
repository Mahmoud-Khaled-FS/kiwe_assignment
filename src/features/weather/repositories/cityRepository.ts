import { sql } from 'kysely';
import { db } from '../../../config/db';
import { Coordinates } from '../types/types';
import { City } from '../models/city';
import { Id } from '../../../types/database';
import AppError from '../../../shared/utils/appError';
import { HttpStatus } from '../../../shared/utils/statusCode';

class CityRepository {
  public async find(where: { id: Id }): Promise<City | null> {
    const city = await db.selectFrom('cities').selectAll().where('id', '=', where.id).executeTakeFirst();
    return city || null;
  }

  public async search(text: string): Promise<Pick<City, 'id' | 'name'> | null> {
    const city = await db
      .selectFrom('cities')
      .select(['id', 'name', sql`similarity(name, ${text})`.as('score')])
      // @ts-ignore
      .where(sql`name % ${text}`)
      .orderBy('score', 'desc')
      .limit(1)
      .executeTakeFirst();
    return city || null;
  }

  public async nearestLocation(coordinate: Coordinates): Promise<Pick<City, 'name' | 'id'> | null> {
    const city = await db
      .selectFrom('cities')
      .select([
        'id',
        'name',
        'latitude',
        'longitude',
        sql<number>`
      6371 * acos(
        cos(radians(${coordinate.lat})) * cos(radians(latitude)) * 
        cos(radians(longitude) - radians(${coordinate.long})) +
        sin(radians(${coordinate.lat})) * sin(radians(latitude)) 
        )`.as('distance_km'),
      ])
      .orderBy('distance_km', 'asc')
      .executeTakeFirst();
    if (!city) {
      return null;
    }
    return {
      id: city.id,
      name: city.name,
    };
  }

  public async saveToFavorites(city: City, userId: Id): Promise<void> {
    const ifExists = await db
      .selectFrom('favorite_cities')
      .where('city_id', '=', city.id)
      .where('user_id', '=', userId)
      .executeTakeFirst();
    if (ifExists) {
      throw new AppError('city already in favorites', HttpStatus.BadRequest);
    }
    const favoriteCity = await db
      .insertInto('favorite_cities')
      .values({
        city_id: city.id,
        user_id: userId,
      })
      .returningAll()
      .executeTakeFirst();
    if (!favoriteCity) {
      throw new Error('can not save city to favorites');
    }
  }

  async getFavorites(userId: Id): Promise<Pick<City, 'id' | 'name'>[]> {
    const favoriteCities = await db
      .selectFrom('favorite_cities')
      .innerJoin('cities', 'cities.id', 'favorite_cities.city_id')
      .select(['cities.id', 'cities.name'])
      .where('favorite_cities.user_id', '=', userId)
      .execute();
    return favoriteCities.map((city) => ({ id: city.id, name: city.name }));
  }
}

export default CityRepository;
