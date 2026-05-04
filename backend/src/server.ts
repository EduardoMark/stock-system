import fastify from 'fastify';
import { env } from './env/env.js';
import { usersRoutes } from './modules/users/users.routes.js';
import z, { ZodError } from 'zod';

const app = fastify();

app.setErrorHandler((error, request, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: z.treeifyError(error) });
  }

  console.error('Unexpected error:', error);
  return reply
    .status(500)
    .send({ message: 'Internal Server Error' });
});

app.get('/', async () => {
  return { status: 'ok' };
});

app.register(usersRoutes, { prefix: '/users' });

try {
  await app.listen({ port: env.PORT });
} catch (error) {
  console.error(error);
  process.exit(1);
}
