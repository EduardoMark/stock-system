import type { FastifyReply, FastifyRequest } from 'fastify';
import {
  addStockMovementSchema,
  type AddStockMovementBody,
} from './dtos/add-stock-movement.dto.js';
import {
  addStockMovement,
  getAgregateStockMovements,
  getAllStockMovements,
  getStockMovementById,
  getStockMovementsByProductId,
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

export async function getStockMovementByIdController(
  req: FastifyRequest,
  res: FastifyReply,
) {
  const { id } = req.params as { id: string };

  const stockMovement = await getStockMovementById(id);
  if (!stockMovement) {
    res.status(404).send({ message: 'Stock movement not found' });
    return;
  }

  res.send(stockMovement);
}

export async function getStockMovementsByProductIdController(
  req: FastifyRequest,
  res: FastifyReply,
) {
  const { productId } = req.params as { productId: string };

  const stockMovements = await getStockMovementsByProductId(productId);
  res.send(stockMovements);
}

export async function getAllStockMovementsController(
  req: FastifyRequest,
  res: FastifyReply,
) {
  const stockMovements = await getAllStockMovements();
  res.send(stockMovements);
}
