import {type FastifyInstance} from 'fastify';
import { createUserController, userLoginController } from './users.controllers.js';

export async function usersRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    await createUserController(request, reply);
  });

  app.post('/login', async (request, reply) => {
    await userLoginController(request, reply);
  });
}