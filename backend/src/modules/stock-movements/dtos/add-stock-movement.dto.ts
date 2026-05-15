import z from 'zod';

export const addStockMovementSchema = z.object({
  product_id: z.string(),
  quantity: z.number(),
  type: z.enum(['IN', 'OUT']),
});

export type AddStockMovementBody = z.infer<typeof addStockMovementSchema>;