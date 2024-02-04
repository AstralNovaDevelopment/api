import z from 'zod';

export const validateEnvironmentSchema = z.object({
  DISCORD_CLIENT_ID: z.string().min(18),
  DISCORD_CLIENT_SECRET: z.string().min(32),
  SESSION_SECRET: z.string().min(1),
  DISCORD_CALLBACK_URL: z.string(),
  REDIS_CACHE_PORT: z.string(),
  DATABASE_PORT: z.string(),
  POSTGRES_USER: z.string(),
  POSTGRES_DB: z.string(),
  JWT_SECRET: z.string(),
  POSTGRES_PASSWORD: z.string(),
});
