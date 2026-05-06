import type { FastifyInstance } from 'fastify';
import { createProductController } from './product.controller.js';

export async function productRoutes(fastify: FastifyInstance) {
  fastify.post('/', async (request, reply) => {
    await createProductController(request, reply);
  });
}