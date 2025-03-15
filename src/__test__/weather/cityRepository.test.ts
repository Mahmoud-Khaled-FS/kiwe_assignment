import { db } from '../../config/db';
import CityRepository from '../../features/weather/repositories/cityRepository';
import { Coordinates } from '../../features/weather/types/types';

describe('CityRepository (Real DB)', () => {
  let cityRepository: CityRepository;

  beforeAll(async () => {
    // Initialize repository with real db
    cityRepository = new CityRepository();
  });

  describe('find', () => {
    test('should return a city by ID', async () => {
      const city = await db.selectFrom('cities').selectAll().executeTakeFirst();
      expect(city).not.toBeNull();
      const result = await cityRepository.find({ id: city!.id });
      expect(result).not.toBeNull();
    });

    test('should return null if city not found', async () => {
      const result = await cityRepository.find({ id: -1 });
      expect(result).toBeNull();
    });
  });

  describe('search', () => {
    test('should return a city by name search', async () => {
      const result = await cityRepository.search('cair');
      expect(result).toHaveProperty('name', 'Cairo');
    });

    test('should return null if no match', async () => {
      const result = await cityRepository.search('Unknown');
      expect(result).toBeNull();
    });
  });

  describe('nearestLocation', () => {
    test('should return nearest city', async () => {
      const coordinates: Coordinates = { lat: 48.8566, long: 2.3522 };
      const result = await cityRepository.nearestLocation(coordinates);
      expect(result?.name).toEqual('Paris');
    });
  });

  describe('saveToFavorites', () => {
    test('should save city to favorites', async () => {
      const cityName = await cityRepository.search('Paris');
      expect(cityName).not.toBeNull();
      const city = await cityRepository.find({ id: cityName!.id });
      expect(city).not.toBeNull();
      const user = await db.selectFrom('users').selectAll().executeTakeFirst();
      await expect(cityRepository.saveToFavorites(city!, user!.id)).resolves.toBeUndefined();
      await db.deleteFrom('favorite_cities').where('user_id', '=', user!.id).execute();
    });
  });

  describe('getFavorites', () => {
    test('should return favorite cities', async () => {
      const user = await db.selectFrom('users').selectAll().executeTakeFirst();
      const city = await db.selectFrom('cities').selectAll().executeTakeFirst();
      try {
        await db.insertInto('favorite_cities').values({ city_id: city!.id, user_id: user!.id }).execute();
      } catch {
        // ignore
      }
      const result = await cityRepository.getFavorites(user!.id);
      const favoriteCity = result.find((city) => city.id === city!.id);
      expect(favoriteCity).not.toBeNull();
      await db.deleteFrom('favorite_cities').where('user_id', '=', user!.id).execute();
    });
  });
});
