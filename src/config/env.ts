import { z, ZodError } from 'zod';

/**
 * Create a Zod schema for environment variables
 */
const configSchema = z.object({
  PORT: z.coerce.number().default(3000),
  TOKEN_PUBLIC: z.string(),
  TOKEN_PRIVATE: z.string(),
  OPEN_WEATHER_API_KEY: z.string().optional(),
  DB_NAME: z.string(),
  DB_HOST: z.string().default('localhost'),
  DB_USER: z.string(),
  DB_PORT: z.coerce.number().default(5432),
  DB_PASSWORD: z.string(),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.coerce.number().default(6379),
  ENCRYPT: z.string().default('false'),
});

export function getConfig(): z.infer<typeof configSchema> {
  try {
    return configSchema.parse(process.env);
  } catch (error) {
    const err = error as ZodError;
    const errorsMessages = err.issues.map((e) => `\t${e.path.join('.')}: ${e.message} (${e.code})\n`);
    console.error(`ERROR: invalid env keys\n${errorsMessages}`);
    process.exit(1);
  }
}

export const Config = getConfig();
