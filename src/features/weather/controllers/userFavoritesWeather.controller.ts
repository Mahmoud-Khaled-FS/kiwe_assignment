import { Request, Response } from 'express';
import { asyncMethod } from '../../../shared/decorators/asyncHandler.decorator';
import CityService from '../services/city.service';
import { HttpStatus } from '../../../shared/utils/statusCode';
import { Id } from '../../../types/database';

class UserFavoritesWeatherController {
  constructor(public readonly cityService: CityService) {
    this.addFavorite = this.addFavorite.bind(this);
  }

  @asyncMethod
  async addFavorite(req: Request, res: Response) {
    await this.cityService.saveToFavorites(+req.params['id'] as Id, req.userId);
    res.sendStatus(HttpStatus.NoContent);
  }
}

export default UserFavoritesWeatherController;
