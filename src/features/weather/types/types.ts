import { Id } from '../../../types/database';

export type Coordinates = {
  long: number;
  lat: number;
};

export type WeatherData = {
  temp: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  city: string;
};

export type CityWeatherResponse = {
  cityId: Id;
  weather: WeatherData;
};
