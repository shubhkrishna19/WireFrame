// ============================================
// PASSWORD HASHING UTILITY (bcrypt)
// ============================================

import bcrypt from 'bcryptjs';
import { config } from '../config/env';

// Hash password
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, config.security.bcryptRounds);
};

// Compare password with hash
export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

// Generate random token (for email verification, password reset)
export const generateToken = (): string => {
  return require('crypto').randomBytes(32).toString('hex');
};

// Generate random string
export const generateRandomString = (length: number): string => {
  return require('crypto')
    .randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
};

export default {
  hashPassword,
  comparePassword,
  generateToken,
  generateRandomString,
};
