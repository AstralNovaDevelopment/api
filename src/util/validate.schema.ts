import z from 'zod';

export const validateEnvironmentSchema = z.object({
  DISCORD_CLIENT_ID: z.string().min(18),
  DISCORD_CLIENT_SECRET: z.string().min(32),
  SESSION_SECRET: z.string().min(1),
  DISCORD_CALLBACK_URL: z.string(),
});
