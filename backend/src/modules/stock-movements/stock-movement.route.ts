import type { FastifyInstance } from 'fastify';
import {
  addStockMovementController,
  getAggregateStockMovementsController,
  getStockMovementByIdController,
  getStockMovementsByProductIdController,
  getAllStockMovementsController
} from './stock-movementts.controller.js';

export async function stockMovimentRoutes(fastify: FastifyInstance) {
  fastify.post('/', async (request, reply) => {
    await addStockMovementController(request, reply);
  });

  fastify.get('/aggregate/:productId', async (request, reply) => {
    await getAggregateStockMovementsController(request, reply);
  });

  fastify.get('/:id', async (request, reply) => {
    await getStockMovementByIdController(request, reply);
  });

  fastify.get('/product/:productId', async (request, reply) => {
    await getStockMovementsByProductIdController(request, reply);
  });

  fastify.get('/', async (request, reply) => {
    await getAllStockMovementsController(request, reply);
  });
}
