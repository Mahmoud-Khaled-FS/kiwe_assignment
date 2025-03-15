import axios from 'axios';
import Config from '../../../config';
import { Coordinates, WeatherData } from '../types/types';
import WeatherApi from './weatherApi';

class OpenWeatherMapApi implements WeatherApi {
  public baseUrl = 'https://api.openweathermap.org/data/2.5';
  private appKey: string;

  constructor() {
    if (!Config.OPEN_WEATHER_API_KEY) {
      throw new Error('Can not use Open Weather Map Adapter!');
    }
    this.appKey = Config.OPEN_WEATHER_API_KEY;
  }

  async getByCoordinate(coordinate: Coordinates): Promise<WeatherData> {
    const url = `${this.baseUrl}/weather?lat=${coordinate.lat}&lon=${coordinate.long}&appid=${this.appKey}`;
    const response = await axios.get<WeatherResponse>(url);
    return {
      city: response.data.name,
      condition: response.data.weather[0]?.main || '',
      humidity: response.data.main.humidity,
      temp: response.data.main.temp,
      windSpeed: response.data.wind.speed,
    };
  }

  async getByCityName(city: string): Promise<WeatherData> {
    const url = `${this.baseUrl}/weather?q=${city}&appid=${this.appKey}`;
    const response = await axios.get<WeatherResponse>(url);
    return {
      city: response.data.name,
      condition: response.data.weather[0]?.main || '',
      humidity: response.data.main.humidity,
      temp: response.data.main.temp,
      windSpeed: response.data.wind.speed,
    };
  }
}

export default OpenWeatherMapApi;

export interface WeatherResponse {
  coord: Coord;
  weather: Weather[];
  base: string;
  main: Main;
  visibility: number;
  wind: Wind;
  clouds: Clouds;
  dt: number;
  sys: Sys;
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface Coord {
  lon: number;
  lat: number;
}

export interface Weather {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface Main {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  sea_level: number;
  grnd_level: number;
}

export interface Wind {
  speed: number;
  deg: number;
  gust: number;
}

export interface Clouds {
  all: number;
}

export interface Sys {
  type: number;
  id: number;
  country: string;
  sunrise: number;
  sunset: number;
}
