import { Router } from 'express';
import WeatherService from '../services/weather.service';
import WeatherController from '../controllers/weather.controller';
import OpenWeatherMapApi from '../adapters/OpenWeatherMapApi';
import CityRepository from '../repositories/cityRepository';
import isAuth from '../../../shared/middleware/isAuth';
import UserFavoritesWeatherController from '../controllers/userFavoritesWeather.controller';
import CityService from '../services/city.service';

export function weatherApi(): Router {
  const cityRepository = new CityRepository();
  const weatherService = new WeatherService(new OpenWeatherMapApi(), cityRepository);
  const weatherController = new WeatherController(weatherService);
  const router = Router();
  router.get('/current', weatherController.currentWeather);
  router.get('/city', weatherController.getWeatherForCity);

  router.use(isAuth);
  const favoritesWeatherController = new UserFavoritesWeatherController(new CityService(cityRepository));
  router.get('/city/favorites', weatherController.getWeatherFavoriteList);
  router.post('/city/:id/favorites', favoritesWeatherController.addFavorite);
  return router;
}
