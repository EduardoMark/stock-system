import { hashPassword } from '../../utils/hash-password.js';
import type { createUserBody } from './dtos/create-user.dto.js';
import {prisma} from '../../../lib/prisma.js';

export async function createUserService(data: createUserBody) {
  const password = await hashPassword(data.password);

  try {
    await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password_hash: password
      }
    });
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Failed to create user', { cause: error });
  }
}