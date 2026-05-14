import { app } from './app.js';
import { env } from './env/env.js';

try {
  await app.listen({ port: env.PORT });
} catch (error) {
  console.error(error);
  process.exit(1);
}
