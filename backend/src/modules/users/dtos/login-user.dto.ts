import {z} from 'zod';

export const loginUserSchema = z.object({
  email: z.email(),
  password: z.string().min(6)
});

export type loginUserBody = z.infer<typeof loginUserSchema>