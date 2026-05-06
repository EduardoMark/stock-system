import type { FastifyReply, FastifyRequest } from 'fastify';
import { createProductSchema, type CreateProductBody } from './dtos/create-product.dto.js';
import { createProductService } from './product.service.js';

export async function createProductController(request: FastifyRequest, reply: FastifyReply) {
  await request.jwtVerify();

  const body: CreateProductBody = createProductSchema.parse(request.body);

  await createProductService(body);

  return reply.status(201).send({ message: 'Product created successfully' });
}