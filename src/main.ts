import 'reflect-metadata';
import 'dotenv/config';
import { Server } from 'node:http';
import { createServer } from './server';
import logger from './shared/utils/logger';
import { pool } from './config/db';
import './config/redis';
import Config, { setupAxiosRetryInterceptor } from './config';
import { setupWebSocket } from './ws ';

process.on('uncaughtException', (error: Error) => {
  // NOTE (MAHMOUD) - Error should handle here!
  // Check if this error is critical or not
  // can send email or notification to Admin if needed!
  logger.error(error);
  process.exit(1);
});

process.on('unhandledRejection', (error: Error) => {
  // NOTE (MAHMOUD) - Error should handle here!
  // Check if this error is critical or not
  // can send email or notification to Admin if needed!
  logger.error(error);
  process.exit(1);
});

async function main() {
  setupAxiosRetryInterceptor();
  const conn = await pool.connect();
  conn.release();
  const app = await createServer();
  const server = new Server(app);
  setupWebSocket(server);
  server.listen(Config.PORT, () => {
    logger.info(`Server is running on port ${Config.PORT}`);
  });
}

main();
