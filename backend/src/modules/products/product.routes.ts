import type { FastifyInstance } from 'fastify';
import { createProductController, getProductsController, getProductByIdController } from './product.controller.js';

export async function productRoutes(fastify: FastifyInstance) {
  fastify.post('/', async (request, reply) => {
    await createProductController(request, reply);
  });

  fastify.get('/', async (request, reply) => {
    await getProductsController(request, reply);
  });

  fastify.get('/:id', async (request, reply) => {
    await getProductByIdController(request, reply);
  });
}