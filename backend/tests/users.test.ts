import { it, beforeAll, afterAll, describe } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { beforeEach } from 'vitest';
import { execSync } from 'node:child_process';

describe('Users routes', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    execSync('npx prisma migrate reset --force');
  });

  it.skip('should be create a new user', async () => {
    await request(app.server)
      .post('/users')
      .send({
        name: 'Dudu',
        email: 'dudu@email.com',
        password: '123456',
      })
      .expect(201);
  });

  it.skip('should be log in with the user', async () => {
    await request(app.server)
      .post('/users')
      .send({
        name: 'Eduardo',
        email: 'eduardo@email.com',
        password: '123456',
      })
      .expect(201);

    await request(app.server)
      .post('/users/login')
      .send({
        email: 'eduardo@email.com',
        password: '123456',
      })
      .expect(200);
  });
});
