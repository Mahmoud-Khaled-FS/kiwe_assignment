import axios from 'axios';
import logger from './logger';

export async function cityFromIp(ip: string): Promise<string | null> {
  try {
    const response = await axios.get(`http://ip-api.com/json/${ip}?fields=city`);
    return response.data.city;
  } catch (err) {
    logger.error(err);
    return null;
  }
}
