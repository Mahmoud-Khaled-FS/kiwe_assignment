import { Request, Response } from 'express';
import AppResponse from '../../../shared/utils/appResponse';
import WeatherService from '../services/weather.service';
import { coordinatesSchema } from '../validation/coordinates.rule';
import AppError from '../../../shared/utils/appError';
import { fromError } from 'zod-validation-error';
import { Responseable } from '../../../types/response';
import { asyncMethod } from '../../../shared/decorators/asyncHandler.decorator';

class WeatherController {
  constructor(public readonly weatherService: WeatherService) {
    this.currentWeather = this.currentWeather.bind(this);
    this.getWeatherForCity = this.getWeatherForCity.bind(this);
    this.getWeatherFavoriteList = this.getWeatherFavoriteList.bind(this);
  }

  @asyncMethod
  async currentWeather(req: Request, res: Response) {
    const getBy = req.query['getBy'] ?? 'ip';
    if (getBy === 'coordinate') {
      const response = await this.getByCoordinate(req);
      res.appRes(response);
      return;
    }
    const ip = req.headers['x-forwarded-for']?.toString();
    if (!ip) {
      res.appRes(new AppError("Can't get ip address from request"));
      return;
    }
    const response = await this.weatherService.getByIp(ip);
    res.appRes(new AppResponse(response));
  }

  @asyncMethod
  async getWeatherForCity(req: Request, res: Response) {
    if (!req.query['city']) {
      res.appRes(new AppError('City name is required!'));
      return;
    }
    const weatherData = await this.weatherService.searchByName(req.query['city'].toString());
    res.appRes(new AppResponse(weatherData));
  }

  @asyncMethod
  async getWeatherFavoriteList(req: Request, res: Response) {
    const response = await this.weatherService.getWeatherForFavorites(req.userId);
    res.appRes(new AppResponse(response));
  }

  private async getByCoordinate(req: Request): Promise<Responseable> {
    const coordinate = coordinatesSchema.safeParse({ long: req.query['long'], lat: req.query['lat'] });
    if (!coordinate.success) {
      return new AppError(fromError(coordinate.error));
    }
    const data = await this.weatherService.getByCoordinate(coordinate.data);
    return new AppResponse(data);
  }
}

export default WeatherController;
