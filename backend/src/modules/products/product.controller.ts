import type { FastifyReply, FastifyRequest } from 'fastify';
import {
  createProductSchema,
  type CreateProductBody,
} from './dtos/create-product.dto.js';
import {
  createProductService,
  getProductsService,
  getProductByIdService,
  updateProductService,
  deleteProductService,
  type ProductFilter,
  type ProductPagination,
} from './product.service.js';
import {
  updateProductSchema,
  type UpdateProductBody,
} from './dtos/update-product.dto.js';

export async function createProductController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  await request.jwtVerify();

  const body: CreateProductBody = createProductSchema.parse(request.body);

  await createProductService(body);

  return reply.status(201).send({ message: 'Product created successfully' });
}

export async function getProductsController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  await request.jwtVerify();

  const { page, limit, name, sku } = request.query as {
    page?: string;
    limit?: string;
    name?: string;
    sku?: string;
  };

  const pagination: ProductPagination = {};

  if (page) {
    pagination.page = Number(page);
  }

  if (limit) {
    pagination.limit = Number(limit);
  }

  const filter: ProductFilter = {};

  if (name) {
    filter.name = name;
  }

  if (sku) {
    filter.sku = sku;
  }

  const products = await getProductsService(
    pagination,
    filter
  );

  return reply.status(200).send(products);
}

export async function getProductByIdController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  await request.jwtVerify();

  const { id } = request.params as { id: string };

  const product = await getProductByIdService(id);

  if (!product) {
    return reply.status(404).send({ message: 'Product not found' });
  }

  return reply.status(200).send(product);
}

export async function updateProductController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  await request.jwtVerify();

  const { id } = request.params as { id: string };
  const body: UpdateProductBody = updateProductSchema.parse(request.body);

  await updateProductService(id, body);

  return reply.status(200).send({ message: 'Product updated successfully' });
}

export async function deleteProductController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  await request.jwtVerify();

  const { id } = request.params as { id: string };

  await deleteProductService(id);

  return reply.status(200).send({ message: 'Product deleted successfully' });
}
