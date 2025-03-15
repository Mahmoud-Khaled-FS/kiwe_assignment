import { Request, Response } from 'express';
import CityRepository from '../../features/weather/repositories/cityRepository';
import WeatherService from '../../features/weather/services/weather.service';
import WeatherController from '../../features/weather/controllers/weather.controller';
import OpenWeatherMapApi from '../../features/weather/adapters/OpenWeatherMapApi';
import AppResponse from '../../shared/utils/appResponse';

jest.mock('../../features/weather/repositories/cityRepository.ts');
jest.mock('../../features/weather/adapters/weatherApi.ts');

const mockResponse = () => {
  const res = {} as Response;
  res.appRes = jest.fn().mockReturnValue(res);
  return res;
};

describe('WeatherController', () => {
  let weatherService: WeatherService;
  let controller: WeatherController;

  beforeEach(() => {
    weatherService = new WeatherService(new OpenWeatherMapApi(), new CityRepository());
    controller = new WeatherController(weatherService);
  });

  it('should return weather for a city', async () => {
    const req = { query: { city: 'Cairo' } } as unknown as Request;
    const res = mockResponse();
    jest.spyOn(weatherService, 'searchByName').mockResolvedValue({
      cityId: 1,
      weather: {
        city: 'Cairo',
        temp: 25,
        condition: 'Sunny',
        humidity: 50,
        windSpeed: 10,
      },
    });

    await controller.getWeatherForCity(req, res);
    expect(weatherService.searchByName).toHaveBeenCalledWith('Cairo');
    expect(res.appRes).toHaveBeenCalledWith(expect.any(AppResponse));
  });

  it('should return weather for favorite cities', async () => {
    const req = { userId: 123 } as unknown as Request;
    const res = mockResponse();
    jest.spyOn(weatherService, 'getWeatherForFavorites').mockResolvedValue([]);

    await controller.getWeatherFavoriteList(req, res);
    expect(weatherService.getWeatherForFavorites).toHaveBeenCalledWith(123);
    expect(res.appRes).toHaveBeenCalledWith(expect.any(AppResponse));
  });
});
