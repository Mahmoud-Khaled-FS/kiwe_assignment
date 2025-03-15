import { UserTable } from '../features/user/models/user';
import { CityTable, FavoriteCityTable } from '../features/weather/models/city';

export type Database = {
  cities: CityTable;
  users: UserTable;
  favorite_cities: FavoriteCityTable;
};

export type Id = number;
