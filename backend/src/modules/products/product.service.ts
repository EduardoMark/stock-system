import { prisma } from '../../../lib/prisma.js';
import { AppError } from '../../erros/app-error.js';
import type { CreateProductBody } from './dtos/create-product.dto.js';

export async function createProductService(data: CreateProductBody) {
  try {
    await prisma.products.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        sku: data.sku
      }
    });
  } catch (error) {
    console.error('Error creating product:', error);

    if (error instanceof Error && 'code' in error && error.code === 'P2002') {
      throw new AppError('SKU must be unique', 400);
    }
    throw new AppError('Failed to create product', 500);
  }
}