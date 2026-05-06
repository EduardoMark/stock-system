import z from 'zod';

export const createProductSchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number().default(0),
  sku: z.string(),
});

export type CreateProductBody = z.infer<typeof createProductSchema>;