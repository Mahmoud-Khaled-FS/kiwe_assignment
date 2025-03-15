import express, { Router } from 'express';
import cors from 'cors';
import helmet from 'helmet';
// import rateLimit from 'express-rate-limit';
// import { rateLimitConfig } from './config/rateLimit';
import Config from './config';
import { appResponseHandlerMiddleware } from './shared/middleware/appResponseAction';
import notFoundHandler from './shared/middleware/notFound';
import globalErrorHandling from './shared/middleware/globalErrorHandling';
import { weatherApi } from './features/weather/routes/api';
import { authApi } from './features/auth';
import logger from './shared/utils/logger';
import { pinoHttp } from 'pino-http';
import { encryptResponseMiddleware } from './shared/middleware/encryptResponse';
import Base64Encryption from './shared/utils/encryption/base64Encryption';
import expressPrometheusMiddleware from 'express-prometheus-middleware';
// import Des64Encryption from './shared/utils/encryption/decEncryption';

export function createServer(): express.Application {
  const app = express();
  app.use(express.json());
  app.use(cors());
  app.use(helmet());
  // app.use(rateLimit(rateLimitConfig));

  app.use(appResponseHandlerMiddleware());

  app.use(pinoHttp({ logger: logger }));

  const encryptionService = new Base64Encryption(); // NOTE (MAHMOUD) - you can select the encryption service here to inject!
  if (Config.ENCRYPT === 'true') {
    app.use(encryptResponseMiddleware(encryptionService));
  }
  const apiRouter = Router();

  apiRouter.use('/auth', authApi());
  apiRouter.use('/weather', weatherApi());

  app.use('/api/v1', apiRouter);

  app.use(
    expressPrometheusMiddleware({
      metricsPath: '/metrics',
      collectDefaultMetrics: true,
      requestDurationBuckets: [0.1, 0.5, 1, 1.5],
      requestLengthBuckets: [512, 1024, 5120, 10240, 51200, 102400],
      responseLengthBuckets: [512, 1024, 5120, 10240, 51200, 102400],
    }),
  );

  app.use(notFoundHandler());
  app.use(globalErrorHandling);

  return app;
}
