import type { FastifyInstance } from 'fastify';
import {
  addStockMovementController,
  getAggregateStockMovementsController,
} from './stock-movementts.controller.js';

export async function stockMovimentRoutes(fastify: FastifyInstance) {
  fastify.post('/', async (request, reply) => {
    await addStockMovementController(request, reply);
  });

  fastify.get('/aggregate/:productId', async (request, reply) => {
    await getAggregateStockMovementsController(request, reply);
  });
}
