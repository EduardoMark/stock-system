import jwt from 'jsonwebtoken';
import { env } from '../../env/env.js';
import { AppError } from '../../erros/app-error.js';

export async function generateToken(userId: string) {
  const token = jwt.sign({ userId }, env.JWT_SECRET, {
    expiresIn: '1h',
    algorithm: 'HS256',
  });

  return token;
}

export async function verifyToken(token: string): Promise<{ userId: string }> {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET, {
      algorithms: ['HS256'],
    }) as { userId: string };

    return decoded;
  } catch (error) {
    console.error('Error verifying token:', error);
    throw new AppError('Invalid or expired token', 401);
  }
}
