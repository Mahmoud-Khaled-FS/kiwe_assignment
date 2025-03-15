import Redis from 'ioredis';
import logger from '../shared/utils/logger';
import { Config } from './env';

const redis = new Redis({
  host: Config.REDIS_HOST,
  port: Config.REDIS_PORT,
});

redis.on('error', (err) => {
  logger.error(err);
});

export default redis;
