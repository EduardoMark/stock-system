import type {FastifyRequest, FastifyReply} from 'fastify';
import {type createUserBody, createUserSchema} from './dtos/create-user.dto.js';
import { createUserService } from './users.services.js';

export async function createUserController(request: FastifyRequest, reply: FastifyReply) {
  const body: createUserBody = createUserSchema.parse(request.body);

  await createUserService(body);

  return reply.status(201).send({ message: 'User created successfully' });
}