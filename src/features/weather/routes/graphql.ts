import OpenWeatherMapApi from '../adapters/OpenWeatherMapApi';
import CityRepository from '../repositories/cityRepository';
import WeatherService from '../services/weather.service';
import { Coordinates } from '../types/types';

export const weatherResolvers = {
  Query: {
    currentWeatherByCoordinate: async (_: any, coordinates: Coordinates) => {
      console.log(coordinates);
      const weatherService = new WeatherService(new OpenWeatherMapApi(), new CityRepository());
      return await weatherService.getByCoordinate(coordinates);
    },
  },
};
