import bcrypt from 'bcrypt';

export async function hashPassword(password: string): Promise<string> {
  const salt = 12;

  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  const isValid = await bcrypt.compare(password, hashedPassword);

  return isValid;
}