import type { FastifyReply, FastifyRequest } from 'fastify';
import {
  addStockMovementSchema,
  type AddStockMovementBody,
} from './dtos/add-stock-movement.dto.js';
import {
  addStockMovement,
  getAgregateStockMovements,
} from './stock-movements.service.js';

export async function addStockMovementController(
  req: FastifyRequest,
  res: FastifyReply,
) {
  const body: AddStockMovementBody = addStockMovementSchema.parse(req.body);
  await addStockMovement(body);
  res.status(201).send({ message: 'Stock movement added successfully' });
}

export async function getAggregateStockMovementsController(
  req: FastifyRequest,
  res: FastifyReply,
) {
  const { productId } = req.params as { productId: string };

  const totalStock = await getAgregateStockMovements(productId);
  res.send({ productId, totalStock });
}
