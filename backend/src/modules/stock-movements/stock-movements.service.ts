import { prisma } from '../../../lib/prisma.js';
import { AppError } from '../../erros/app-error.js';
import type { AddStockMovementBody } from './dtos/add-stock-movement.dto.js';

export async function addStockMovement(data: AddStockMovementBody) {
  try {
    if (data.type === 'IN') {
      await prisma.stock_movements.create({
        data: {
          product_id: data.product_id,
          quantity: data.quantity,
          type: 'IN',
        },
      });
      return;
    }

    if (data.type === 'OUT') {
      const currentStock = await getAgregateStockMovements(data.product_id);

      if (currentStock < data.quantity) {
        throw new AppError('Insufficient stock for this movement', 400);
      }

      await prisma.stock_movements.create({
        data: {
          product_id: data.product_id,
          quantity: -data.quantity,
          type: 'OUT',
        },
      });
      return;
    }
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    console.error('Error adding stock movement:', error);
    throw new AppError('Failed to add stock movement', 500);
  }

}

export async function getAgregateStockMovements(productId: string) {
  try {
    const stockTotal = await prisma.stock_movements.aggregate({
      where: { product_id: productId },
      _sum: {
        quantity: true,
      },
    });

    return stockTotal._sum.quantity || 0;
  } catch (error) {
    console.error('Error getting aggregate stock movements:', error);
    throw new AppError('Failed to get aggregate stock movements', 500);
  }
}