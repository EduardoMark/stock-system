import z from 'zod';

export const updateProductSchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number().default(0),
  sku: z.string(),
});

export type UpdateProductBody = z.infer<typeof updateProductSchema>;