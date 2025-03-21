import { Options as RateLimitOptions } from 'express-rate-limit';

/**
 * export rate limit config
 */
export const rateLimitConfig: Partial<RateLimitOptions> = {
  windowMs: 1 * 60 * 1000,
};
