import { it, describe, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { execSync } from 'node:child_process';

describe('Products routes', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    execSync('npx prisma migrate dev');
  });

  it.skip('should be create a new product', async () => {
    request(app.server)
      .post('/products')
      .send({
        name: 'Tênis',
        description: 'Tênis da nike',
        amount: 1000,
        sku: 123
      })
      .expect(201);
  });

  it('should be failed create a new product because duplicate sku', async () => {
    request(app.server)
      .post('/products')
      .send({
        name: 'Camisa',
        description: 'Tênis da Camisa cara',
        amount: 1000,
        sku: 123
      })
      .expect(201);

    request(app.server)
      .post('/products')
      .send({
        name: 'Camisa',
        description: 'Tênis da Camisa cara',
        amount: 1000,
        sku: 123
      })
      .expect(400);
  });
});
