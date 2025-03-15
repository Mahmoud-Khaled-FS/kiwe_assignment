import redis from '../../config/redis';
import WeatherApi from '../../features/weather/adapters/weatherApi';
import CityRepository from '../../features/weather/repositories/cityRepository';
import WeatherService from '../../features/weather/services/weather.service';
import { Coordinates, WeatherData } from '../../features/weather/types/types';
import AppError from '../../shared/utils/appError';
import { cityFromIp } from '../../shared/utils/ip';
import { Id } from '../../types/database';

// Mock dependencies
jest.mock('../../features/weather/adapters/OpenWeatherMapApi.ts');
jest.mock('../../features/weather/repositories/cityRepository.ts');
jest.mock('../../shared/utils/ip.ts');
jest.mock('../../config/redis.ts');
jest.mock('../../shared/utils/appError.ts', () => {
  return jest.fn().mockImplementation((message) => {
    return new Error(message); // Simplified mock for AppError
  });
});

describe('WeatherService', () => {
  // Mocked dependencies
  // @ts-ignore
  const mockWeatherApi = { getByCityName: jest.fn() } as jest.Mocked<WeatherApi>;
  // @ts-ignore
  const mockCityRepository = {
    nearestLocation: jest.fn(),
    search: jest.fn(),
    getFavorites: jest.fn(),
  } as jest.Mocked<CityRepository>;
  const mockCityFromIp = cityFromIp as jest.MockedFunction<typeof cityFromIp>;
  // @ts-ignore
  const mockRedis = {
    get: jest.fn(),
    set: jest.fn(),
  } as jest.Mocked<typeof redis>;
  const MockAppError = AppError as jest.MockedClass<typeof AppError>;

  let weatherService: WeatherService;

  beforeEach(() => {
    jest.clearAllMocks();
    weatherService = new WeatherService(mockWeatherApi, mockCityRepository);
  });

  describe('getByCoordinate', () => {
    const mockCoordinates: Coordinates = { lat: 40.7128, long: -74.006 };
    const mockCity = { id: 1, name: 'New York' };
    const mockWeather: WeatherData = {
      city: 'New York',
      condition: 'Clear',
      humidity: 53,
      temp: 293.15,
      windSpeed: 5.1,
    };

    test('should return weather and city ID for valid coordinates', async () => {
      mockCityRepository.nearestLocation.mockResolvedValue(mockCity);
      mockWeatherApi.getByCityName.mockResolvedValue(mockWeather);
      mockRedis.get.mockResolvedValue(null); // No cache
      mockRedis.set.mockResolvedValue('OK');

      const result = await weatherService.getByCoordinate(mockCoordinates);

      expect(result).toEqual({ weather: mockWeather, cityId: 1 });
      expect(mockCityRepository.nearestLocation).toHaveBeenCalledWith(mockCoordinates);
      expect(mockWeatherApi.getByCityName).toHaveBeenCalledWith('New York');
    });

    test('should throw AppError if no city is found', async () => {
      mockCityRepository.nearestLocation.mockResolvedValue(null);

      await expect(weatherService.getByCoordinate(mockCoordinates)).rejects.toThrow(
        'can not get city from this coordinates!',
      );
      expect(MockAppError).toHaveBeenCalledWith('can not get city from this coordinates!');
    });
  });

  describe('searchByName', () => {
    const mockCity = { id: 2, name: 'Tokyo' };
    const mockWeather: WeatherData = {
      city: 'Tokyo',
      condition: 'Clouds',
      humidity: 65,
      temp: 298.15,
      windSpeed: 3.6,
    };

    test('should return weather and city ID for valid city name', async () => {
      mockCityRepository.search.mockResolvedValue(mockCity);
      mockWeatherApi.getByCityName.mockResolvedValue(mockWeather);
      mockRedis.get.mockResolvedValue(null);
      mockRedis.set.mockResolvedValue('OK');

      const result = await weatherService.searchByName('Tokyo');

      expect(result).toEqual({ weather: mockWeather, cityId: 2 });
      expect(mockCityRepository.search).toHaveBeenCalledWith('Tokyo');
      expect(mockWeatherApi.getByCityName).toHaveBeenCalledWith('Tokyo');
    });

    test('should throw AppError if city is not found', async () => {
      mockCityRepository.search.mockResolvedValue(null);

      await expect(weatherService.searchByName('Unknown')).rejects.toThrow(
        'can not found city with this name city:Unknown',
      );
      expect(MockAppError).toHaveBeenCalledWith('can not found city with this name city:Unknown');
    });
  });

  describe('getByIp', () => {
    const mockWeather: WeatherData = {
      city: 'London',
      condition: 'Rain',
      humidity: 80,
      temp: 288.15,
      windSpeed: 4.0,
    };
    const mockCity = { id: 3, name: 'London' };

    test('should return weather and city ID for valid IP', async () => {
      mockCityFromIp.mockResolvedValue('London');
      mockCityRepository.search.mockResolvedValue(mockCity);
      mockWeatherApi.getByCityName.mockResolvedValue(mockWeather);
      mockRedis.get.mockResolvedValue(null);
      mockRedis.set.mockResolvedValue('OK');

      const result = await weatherService.getByIp('8.8.8.8');

      expect(result).toEqual({ weather: mockWeather, cityId: 3 });
      expect(mockCityFromIp).toHaveBeenCalledWith('8.8.8.8');
      expect(mockCityRepository.search).toHaveBeenCalledWith('London');
    });

    test('should throw AppError if city name cannot be determined from IP', async () => {
      mockCityFromIp.mockResolvedValue(null);

      await expect(weatherService.getByIp('8.8.8.8')).rejects.toThrow('Can not get city name from your ip!');
      expect(MockAppError).toHaveBeenCalledWith('Can not get city name from your ip!');
    });
  });

  describe('getWeatherForFavorites', () => {
    const mockUserId: Id = 123;
    const mockCities = [
      { id: 1, name: 'New York' },
      { id: 2, name: 'Tokyo' },
    ];
    const mockWeatherNY: WeatherData = {
      city: 'New York',
      condition: 'Clear',
      humidity: 53,
      temp: 293.15,
      windSpeed: 5.1,
    };
    const mockWeatherTokyo: WeatherData = {
      city: 'Tokyo',
      condition: 'Clouds',
      humidity: 65,
      temp: 298.15,
      windSpeed: 3.6,
    };

    test('should return weather for all favorite cities', async () => {
      mockCityRepository.getFavorites.mockResolvedValue(mockCities);
      mockWeatherApi.getByCityName.mockResolvedValueOnce(mockWeatherNY).mockResolvedValueOnce(mockWeatherTokyo);
      mockRedis.get.mockResolvedValue(null);
      mockRedis.set.mockResolvedValue('OK');

      const result = await weatherService.getWeatherForFavorites(mockUserId);

      expect(result).toEqual([
        { weather: mockWeatherNY, cityId: 1 },
        { weather: mockWeatherTokyo, cityId: 2 },
      ]);
      expect(mockCityRepository.getFavorites).toHaveBeenCalledWith(mockUserId);
      expect(mockWeatherApi.getByCityName).toHaveBeenCalledTimes(2);
      expect(mockWeatherApi.getByCityName).toHaveBeenCalledWith('New York');
      expect(mockWeatherApi.getByCityName).toHaveBeenCalledWith('Tokyo');
    });
  });

  describe('fetchWeather (via public methods)', () => {
    const mockWeather: WeatherData = {
      city: 'Paris',
      condition: 'Rain',
      humidity: 70,
      temp: 290.15,
      windSpeed: 2.5,
    };
    beforeEach(() => {
      // Reset all mocks to ensure isolation
      jest.clearAllMocks();
      mockCityRepository.search.mockResolvedValue({ id: 4, name: 'Paris' });
      mockRedis.get.mockResolvedValue(null); // Default to no cache
      mockWeatherApi.getByCityName.mockResolvedValue(mockWeather); // Default API response
      mockRedis.set.mockResolvedValue('OK');
    });

    test('should return cached weather if available', async () => {
      mockCityRepository.search.mockResolvedValue({ id: 4, name: 'Paris' });
      mockRedis.get.mockResolvedValue(JSON.stringify(mockWeather));

      const result = await weatherService.searchByName('Paris');
      expect(result).toEqual({ weather: mockWeather, cityId: 4 });
    });

    test('should fetch and cache weather if not in cache', async () => {
      mockCityRepository.search.mockResolvedValue({ id: 4, name: 'Paris' });
      mockRedis.get.mockResolvedValue(null);
      mockWeatherApi.getByCityName.mockResolvedValue(mockWeather);
      mockRedis.set.mockResolvedValue('OK');

      const result = await weatherService.searchByName('Paris');

      expect(result).toEqual({ weather: mockWeather, cityId: 4 });
      expect(mockWeatherApi.getByCityName).toHaveBeenCalledWith('Paris');
    });
  });
});
