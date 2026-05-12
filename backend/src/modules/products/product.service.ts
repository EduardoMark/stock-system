import { prisma } from '../../../lib/prisma.js';
import { type ProductsModel } from '../../../generated/prisma/models.js';
import { AppError } from '../../erros/app-error.js';
import type { CreateProductBody } from './dtos/create-product.dto.js';
import type { UpdateProductBody } from './dtos/update-product.dto.js';

export type ProductPagination = {
  page?: number;
  limit?: number;
}

export type ProductFilter = {
  name?: string;
  sku?: string;
}

export async function createProductService(data: CreateProductBody) {
  try {
    await prisma.products.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        sku: data.sku,
      },
    });
  } catch (error) {
    console.error('Error creating product:', error);

    if (error instanceof Error && 'code' in error && error.code === 'P2002') {
      throw new AppError('SKU must be unique', 400);
    }
    throw new AppError('Failed to create product', 500);
  }
}

export async function getProductsService(
  pagination?: ProductPagination,
  filter?: ProductFilter,
): Promise<ProductsModel[]> {
  const page = Math.max(1, pagination?.page ?? 1);
  const limit = Math.min(100, Math.max(1, pagination?.limit ?? 10));


  try {
    const products = await prisma.products.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: {
        ...(filter?.name && { name: filter.name }),
        ...(filter?.sku && { sku: filter.sku }),
      },
    });
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new AppError('Failed to fetch products', 500);
  }
}

export async function getProductByIdService(
  id: string,
): Promise<ProductsModel | null> {
  try {
    const product = await prisma.products.findFirst({
      where: { id },
    });

    return product;
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    throw new AppError('Failed to fetch product', 500);
  }
}

export async function updateProductService(
  id: string,
  data: UpdateProductBody,
): Promise<void> {
  try {
    await prisma.products.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        sku: data.sku,
      },
    });
  } catch (error) {
    console.error('Error updating product:', error);
    throw new AppError('Failed to update product', 500);
  }
}

export async function deleteProductService(id: string): Promise<void> {
  try {
    await prisma.products.delete({
      where: { id },
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    throw new AppError('Failed to delete product', 500);
  }
}
