import { comparePassword, hashPassword } from '../../utils/hash-password.js';
import {prisma} from '../../../lib/prisma.js';
import { AppError } from '../../erros/app-error.js';
import type { createUserBody } from './dtos/create-user.dto.js';

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
    throw new AppError('Failed to create user', 500);
  }
}

export async function userLoginService(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: {
      email
    },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  const isValidPassword = await comparePassword(password, user.password_hash);

  if (!isValidPassword) {
    throw new AppError('Invalid credentials', 401);
  }

  return user;
}