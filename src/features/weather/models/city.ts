import { Generated, Selectable } from 'kysely';
import { Id } from '../../../types/database';

export type CityTable = {
  id: Generated<Id>;
  name: string;
  country_code: string;
  longitude: string;
  latitude: string;
  open_weather_id?: number;
};

export type City = Selectable<CityTable>;

export type FavoriteCityTable = {
  id: Generated<Id>;
  city_id: number;
  user_id: number;
};
