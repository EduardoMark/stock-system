import fastify from 'fastify';
import { env } from './env/env.js';
import { usersRoutes } from './modules/users/users.routes.js';
import z, { ZodError } from 'zod';
import { AppError } from './erros/app-error.js';
import { productRoutes } from './modules/products/product.routes.js';
import jwt from '@fastify/jwt';
import type { FastifyError } from 'fastify';

export const app = fastify();

app.register(jwt, {
  secret: env.JWT_SECRET,
});

app.setErrorHandler((error, request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({ message: z.treeifyError(error) });
  }

  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({ message: error.message });
  }

  if ((error as FastifyError).code === 'FST_JWT_NO_AUTHORIZATION_IN_HEADER') {
    return reply.status(401).send({
      message: 'Token not provided',
    });
  }

  if ((error as FastifyError).code === 'FST_JWT_AUTHORIZATION_TOKEN_INVALID') {
    return reply.status(401).send({
      message: 'Token invalid',
    });
  }

  if ((error as FastifyError).code === 'FST_JWT_AUTHORIZATION_TOKEN_EXPIRED') {
    return reply.status(401).send({
      message: 'Token expired',
    });
  }

  return reply.status(500).send({ message: 'Internal Server Error' });
});

app.get('/', async () => {
  return { status: 'ok' };
});

app.register(usersRoutes, { prefix: '/users' });
app.register(productRoutes, { prefix: '/products' });
