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
  request: FastifyRequest,
  reply: FastifyReply,
) {
  await request.jwtVerify();

  const body: AddStockMovementBody = addStockMovementSchema.parse(request.body);
  await addStockMovement(body);
  reply.status(201).send({ message: 'Stock movement added successfully' });
}

export async function getAggregateStockMovementsController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { productId } = request.params as { productId: string };

  const totalStock = await getAgregateStockMovements(productId);
  reply.send({ productId, totalStock });
}

export async function getStockMovementByIdController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = request.params as { id: string };

  const stockMovement = await getStockMovementById(id);
  if (!stockMovement) {
    reply.status(404).send({ message: 'Stock movement not found' });
    return;
  }

  reply.send(stockMovement);
}

export async function getStockMovementsByProductIdController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { productId } = request.params as { productId: string };

  const stockMovements = await getStockMovementsByProductId(productId);
  reply.send(stockMovements);
}

export async function getAllStockMovementsController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const stockMovements = await getAllStockMovements();
  reply.send(stockMovements);
}
