import AppError from '../../../shared/utils/appError';
import { HttpStatus } from '../../../shared/utils/statusCode';
import { Id } from '../../../types/database';
import CityRepository from '../repositories/cityRepository';

class CityService {
  public constructor(private readonly cityRepository: CityRepository) {}

  public async saveToFavorites(id: Id, userId: Id): Promise<void> {
    const city = await this.cityRepository.find({ id });
    if (!city) {
      throw new AppError(`can not found city with this name city:${name}`, HttpStatus.NotFound);
    }
    return await this.cityRepository.saveToFavorites(city, userId);
  }
}

export default CityService;
