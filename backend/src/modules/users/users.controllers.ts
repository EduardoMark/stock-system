import type {FastifyRequest, FastifyReply} from 'fastify';
import {type createUserBody, createUserSchema} from './dtos/create-user.dto.js';
import { createUserService, userLoginService } from './users.services.js';
import { loginUserSchema, type loginUserBody } from './dtos/login-user.dto.js';

export async function createUserController(request: FastifyRequest, reply: FastifyReply) {
  const body: createUserBody = createUserSchema.parse(request.body);

  await createUserService(body);

  return reply.status(201).send({ message: 'User created successfully' });
}

export async function userLoginController(request: FastifyRequest, reply: FastifyReply) {
  const body: loginUserBody = loginUserSchema.parse(request.body);

  const user = await userLoginService(body.email, body.password);

  const token = await reply.jwtSign({userId: user.id}, { expiresIn: '1h' });
  return reply.send({ token });
}