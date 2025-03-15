import AppError from '../../../shared/utils/appError';
import WeatherApi from '../adapters/weatherApi';
import CityRepository from '../repositories/cityRepository';
import { CityWeatherResponse, Coordinates, WeatherData } from '../types/types';
import { cityFromIp } from '../../../shared/utils/ip';
import { Id } from '../../../types/database';
import redis from '../../../config/redis';

class WeatherService {
  public constructor(
    private readonly weatherApi: WeatherApi,
    private readonly cityRepository: CityRepository,
  ) {}

  public async getByCoordinate(coordinates: Coordinates): Promise<CityWeatherResponse> {
    const city = await this.cityRepository.nearestLocation(coordinates);
    if (!city) {
      throw new AppError('can not get city from this coordinates!');
    }
    const weather = await this.fetchWeather(city.name);
    return { weather: weather, cityId: city.id };
  }

  public async searchByName(cityName: string): Promise<CityWeatherResponse> {
    const city = await this.cityRepository.search(cityName);
    if (!city) {
      throw new AppError(`can not found city with this name city:${cityName}`);
    }
    const weatherData = await this.fetchWeather(city.name);
    return { weather: weatherData, cityId: city.id };
  }

  public async getByIp(ip: string): Promise<CityWeatherResponse> {
    const cityName = await cityFromIp(ip);
    if (!cityName) {
      throw new AppError('Can not get city name from your ip!');
    }
    return this.searchByName(cityName);
  }

  public async getWeatherForFavorites(userId: Id): Promise<CityWeatherResponse[]> {
    const favoriteCities = await this.cityRepository.getFavorites(userId);
    return Promise.all(
      favoriteCities.map(async (city) => {
        const weather = await this.fetchWeather(city.name);
        return { weather: weather, cityId: city.id };
      }),
    );
  }

  private async fetchWeather(city: string): Promise<WeatherData> {
    const cacheKet = `weather:${city}`;
    const cachedWeather = await redis.get(cacheKet);
    if (cachedWeather) {
      return JSON.parse(cachedWeather) as WeatherData;
    }
    const weather = await this.weatherApi.getByCityName(city);
    await redis.set(cacheKet, JSON.stringify(weather));
    return weather;
  }
}

export default WeatherService;
