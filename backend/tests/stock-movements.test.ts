import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { prisma } from '../lib/prisma.js';

type ProductSeed = {
  id: string;
  name: string;
  description: string;
  sku: string;
};

async function createProductSeed(data: ProductSeed) {
  await prisma.products.create({
    data: {
      id: data.id,
      name: data.name,
      description: data.description,
      sku: data.sku,
      price: 100,
    },
  });
}

describe('Stock movements routes', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await prisma.stock_movements.deleteMany();
    await prisma.products.deleteMany();
  });

  it('should create an IN stock movement', async () => {
    const productId = '11111111-1111-1111-1111-111111111111';
    await createProductSeed({
      id: productId,
      name: 'Notebook',
      description: 'Notebook para testes',
      sku: 'SKU-IN-001',
    });

    const response = await request(app.server).post('/stock-movements').send({
      product_id: productId,
      type: 'IN',
      quantity: 10,
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: 'Stock movement added successfully',
    });

    const movement = await prisma.stock_movements.findFirst({
      where: { product_id: productId },
    });

    expect(movement?.type).toBe('IN');
    expect(movement?.quantity).toBe(10);
  });

  it('should create an OUT stock movement when there is enough stock', async () => {
    const productId = '22222222-2222-2222-2222-222222222222';
    await createProductSeed({
      id: productId,
      name: 'Mouse',
      description: 'Mouse para testes',
      sku: 'SKU-OUT-001',
    });

    await request(app.server).post('/stock-movements').send({
      product_id: productId,
      type: 'IN',
      quantity: 15,
    });

    const response = await request(app.server).post('/stock-movements').send({
      product_id: productId,
      type: 'OUT',
      quantity: 8,
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: 'Stock movement added successfully',
    });

    const aggregateResponse = await request(app.server).get(
      `/stock-movements/aggregate/${productId}`,
    );

    expect(aggregateResponse.status).toBe(200);
    expect(aggregateResponse.body).toEqual({ productId, totalStock: 7 });
  });

  it('should fail to create an OUT stock movement when stock is insufficient', async () => {
    const productId = '33333333-3333-3333-3333-333333333333';
    await createProductSeed({
      id: productId,
      name: 'Teclado',
      description: 'Teclado para testes',
      sku: 'SKU-OUT-002',
    });

    await request(app.server).post('/stock-movements').send({
      product_id: productId,
      type: 'IN',
      quantity: 5,
    });

    const response = await request(app.server).post('/stock-movements').send({
      product_id: productId,
      type: 'OUT',
      quantity: 9,
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: 'Insufficient stock for this movement',
    });
  });

  it('should fail with invalid payload when creating stock movement', async () => {
    const productId = '44444444-4444-4444-4444-444444444444';
    await createProductSeed({
      id: productId,
      name: 'Monitor',
      description: 'Monitor para testes',
      sku: 'SKU-VALIDATION-001',
    });

    const response = await request(app.server).post('/stock-movements').send({
      product_id: productId,
      type: 'INVALID_TYPE',
      quantity: 4,
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
  });

  it('should get a stock movement by id', async () => {
    const productId = '55555555-5555-5555-5555-555555555555';
    await createProductSeed({
      id: productId,
      name: 'Cadeira',
      description: 'Cadeira para testes',
      sku: 'SKU-GET-ID-001',
    });

    await request(app.server).post('/stock-movements').send({
      product_id: productId,
      type: 'IN',
      quantity: 12,
    });

    const movement = await prisma.stock_movements.findFirstOrThrow({
      where: { product_id: productId },
    });

    const response = await request(app.server).get(
      `/stock-movements/${movement.id}`,
    );

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(movement.id);
    expect(response.body.product_id).toBe(productId);
    expect(response.body.quantity).toBe(12);
  });

  it('should return 404 when stock movement id does not exist', async () => {
    const response = await request(app.server).get(
      '/stock-movements/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    );

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Stock movement not found' });
  });

  it('should get stock movements by product id', async () => {
    const firstProductId = '66666666-6666-6666-6666-666666666666';
    const secondProductId = '77777777-7777-7777-7777-777777777777';

    await createProductSeed({
      id: firstProductId,
      name: 'Produto A',
      description: 'Produto A para testes',
      sku: 'SKU-PROD-A-001',
    });

    await createProductSeed({
      id: secondProductId,
      name: 'Produto B',
      description: 'Produto B para testes',
      sku: 'SKU-PROD-B-001',
    });

    await request(app.server).post('/stock-movements').send({
      product_id: firstProductId,
      type: 'IN',
      quantity: 11,
    });

    await request(app.server).post('/stock-movements').send({
      product_id: firstProductId,
      type: 'OUT',
      quantity: 3,
    });

    await request(app.server).post('/stock-movements').send({
      product_id: secondProductId,
      type: 'IN',
      quantity: 50,
    });

    const response = await request(app.server).get(
      `/stock-movements/product/${firstProductId}`,
    );

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(
      response.body.every(
        (movement: { product_id: string }) =>
          movement.product_id === firstProductId,
      ),
    ).toBe(true);
  });

  it('should get all stock movements', async () => {
    const firstProductId = '88888888-8888-8888-8888-888888888888';
    const secondProductId = '99999999-9999-9999-9999-999999999999';

    await createProductSeed({
      id: firstProductId,
      name: 'Impressora',
      description: 'Impressora para testes',
      sku: 'SKU-ALL-001',
    });

    await createProductSeed({
      id: secondProductId,
      name: 'Scanner',
      description: 'Scanner para testes',
      sku: 'SKU-ALL-002',
    });

    await request(app.server).post('/stock-movements').send({
      product_id: firstProductId,
      type: 'IN',
      quantity: 20,
    });

    await request(app.server).post('/stock-movements').send({
      product_id: secondProductId,
      type: 'IN',
      quantity: 30,
    });

    const response = await request(app.server).get('/stock-movements');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
  });
});
