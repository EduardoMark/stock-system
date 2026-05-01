import 'dotenv/config';
import {z} from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('production'),
  DATABASE_URL: z.string(),
  PORT: z.number().default(3000),
});

const _env = envSchema.safeParse(process.env);
if (!_env.success) {
  console.error('Invalid environment variables:', _env.error);
  process.exit(1);
}

export const env = _env.data;