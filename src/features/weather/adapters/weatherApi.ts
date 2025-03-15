import { Coordinates, WeatherData } from '../types/types';

export default interface WeatherApi {
  getByCoordinate(coordinates: Coordinates): WeatherData | Promise<WeatherData>;
  getByCityName(city: string): WeatherData | Promise<WeatherData>;
}
