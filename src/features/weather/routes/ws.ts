import { WebSocket } from 'ws';
import { Coordinates } from '../types/types';
import { coordinatesSchema } from '../validation/coordinates.rule';
import CityRepository from '../repositories/cityRepository';
import OpenWeatherMapApi from '../adapters/OpenWeatherMapApi';
import WeatherService from '../services/weather.service';

export async function currentWeatherWs(ws: WebSocket, data: unknown) {
  const coordinateValidation = coordinatesSchema.safeParse(data);
  if (!coordinateValidation.success) {
    ws.send(JSON.stringify({ error: 'Invalid coordinates' }));
    return;
  }

  const coordinates: Coordinates = coordinateValidation.data;
  const weatherService = new WeatherService(new OpenWeatherMapApi(), new CityRepository());

  const weather = await weatherService.getByCoordinate(coordinates);
  ws.send(JSON.stringify(weather));
}
