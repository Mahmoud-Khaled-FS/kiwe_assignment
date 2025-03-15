import axios from 'axios';
import Config from '../../config';
import OpenWeatherMapApi, { WeatherResponse } from '../../features/weather/adapters/OpenWeatherMapApi';
import { Coordinates } from '../../features/weather/types/types';

// Mock axios and Config
jest.mock('axios');
jest.mock('../../config/index.ts', () => ({
  OPEN_WEATHER_API_KEY: 'mock-api-key', // Default mock value
}));

describe('OpenWeatherMapApi', () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;
  const mockedConfig = Config as jest.Mocked<typeof Config>;

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks between tests
    mockedConfig.OPEN_WEATHER_API_KEY = 'mock-api-key'; // Reset default
  });

  describe('constructor', () => {
    test('should initialize with valid API key', () => {
      const weatherApi = new OpenWeatherMapApi();
      expect(weatherApi).toBeDefined();
      expect(weatherApi['appKey']).toBe('mock-api-key'); // Access private field
    });

    test('should throw error if API key is missing', () => {
      mockedConfig.OPEN_WEATHER_API_KEY = undefined;
      expect(() => new OpenWeatherMapApi()).toThrow('Can not use Open Weather Map Adapter!');
    });
  });

  describe('getByCoordinate', () => {
    const mockCoordinates: Coordinates = { lat: 40.7128, long: -74.006 };
    const mockResponse: WeatherResponse = {
      coord: { lon: -74.006, lat: 40.7128 },
      weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
      base: 'stations',
      main: {
        temp: 293.15,
        feels_like: 292.5,
        temp_min: 290,
        temp_max: 295,
        pressure: 1012,
        humidity: 53,
        sea_level: 1012,
        grnd_level: 1000,
      },
      visibility: 10000,
      wind: { speed: 5.1, deg: 270, gust: 7.2 },
      clouds: { all: 0 },
      dt: 1630000000,
      sys: { type: 1, id: 1234, country: 'US', sunrise: 1630000000, sunset: 1630040000 },
      timezone: -14400,
      id: 5128581,
      name: 'New York',
      cod: 200,
    };

    test('should return weather data for valid coordinates', async () => {
      mockedAxios.get.mockResolvedValue({ data: mockResponse });

      const weatherApi = new OpenWeatherMapApi();
      const result = await weatherApi.getByCoordinate(mockCoordinates);

      expect(result).toEqual({
        city: 'New York',
        condition: 'Clear',
        humidity: 53,
        temp: 293.15,
        windSpeed: 5.1,
      });
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api.openweathermap.org/data/2.5/weather?lat=40.7128&lon=-74.006&appid=mock-api-key',
      );
    });

    test('should throw error on axios failure', async () => {
      const error = new Error('Network error');
      mockedAxios.get.mockRejectedValue(error);

      const weatherApi = new OpenWeatherMapApi();
      await expect(weatherApi.getByCoordinate(mockCoordinates)).rejects.toThrow('Network error');
    });
  });

  describe('getByCityName', () => {
    const mockResponse: WeatherResponse = {
      coord: { lon: 139.6917, lat: 35.6895 },
      weather: [{ id: 801, main: 'Clouds', description: 'few clouds', icon: '02d' }],
      base: 'stations',
      main: {
        temp: 298.15,
        feels_like: 297.5,
        temp_min: 295,
        temp_max: 300,
        pressure: 1010,
        humidity: 65,
        sea_level: 1010,
        grnd_level: 998,
      },
      visibility: 10000,
      wind: { speed: 3.6, deg: 180, gust: 5.0 },
      clouds: { all: 20 },
      dt: 1630000000,
      sys: { type: 1, id: 5678, country: 'JP', sunrise: 1630000000, sunset: 1630040000 },
      timezone: 32400,
      id: 1850147,
      name: 'Tokyo',
      cod: 200,
    };

    test('should return weather data for valid city name', async () => {
      mockedAxios.get.mockResolvedValue({ data: mockResponse });

      const weatherApi = new OpenWeatherMapApi();
      const result = await weatherApi.getByCityName('Tokyo');

      expect(result).toEqual({
        city: 'Tokyo',
        condition: 'Clouds',
        humidity: 65,
        temp: 298.15,
        windSpeed: 3.6,
      });
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api.openweathermap.org/data/2.5/weather?q=Tokyo&appid=mock-api-key',
      );
    });

    test('should throw error on axios failure', async () => {
      const error = new Error('City not found');
      mockedAxios.get.mockRejectedValue(error);

      const weatherApi = new OpenWeatherMapApi();
      await expect(weatherApi.getByCityName('InvalidCity')).rejects.toThrow('City not found');
    });

    test('should handle missing weather condition gracefully', async () => {
      const mockResponseNoWeather: WeatherResponse = {
        ...mockResponse,
        weather: [], // No weather data
      };
      mockedAxios.get.mockResolvedValue({ data: mockResponseNoWeather });

      const weatherApi = new OpenWeatherMapApi();
      const result = await weatherApi.getByCityName('Tokyo');

      expect(result).toEqual({
        city: 'Tokyo',
        condition: '', // Fallback for missing weather[0]
        humidity: 65,
        temp: 298.15,
        windSpeed: 3.6,
      });
    });
  });
});
