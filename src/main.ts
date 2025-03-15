import 'reflect-metadata';
import 'dotenv/config';
import { createServer } from './server';
import logger from './shared/utils/logger';
import { pool } from './config/db';
import './config/redis';
import Config from './config';

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
  const conn = await pool.connect();
  conn.release();
  const app = createServer();
  app.listen(Config.PORT, () => {
    logger.info(`Server is running on port ${Config.PORT}`);
  });
}

main();
