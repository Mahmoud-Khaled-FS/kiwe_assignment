import pino from 'pino';
import Config from '../../config';

const options =
  Config.NODE_ENV === 'development'
    ? { target: 'pino-pretty', options: { colorize: true } }
    : { target: 'pino/file', options: { destination: './logs/app.log' } };

const logger = pino({
  transport: {
    ...options,
    level: Config.NODE_ENV === 'development' ? 'debug' : 'info',
  },
});

export default logger;
