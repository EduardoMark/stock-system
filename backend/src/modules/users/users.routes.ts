import {type FastifyInstance} from 'fastify';
import { createUserController } from './users.controllers.js';

export async function usersRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    await createUserController(request, reply);
  });
}