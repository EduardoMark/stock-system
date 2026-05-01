import fastify from 'fastify';
import { env } from './env/env.js';

const app = fastify();

app.get('/', async () => {
  return { status: 'ok' };
});

try {
  await app.listen({ port: env.PORT });
} catch (error) {
  console.error(error);
  process.exit(1);
}
