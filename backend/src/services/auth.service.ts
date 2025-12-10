// ============================================
// AUTHENTICATION SERVICE
// ============================================

import { query } from '../config/database';
import { hashPassword, comparePassword, generateToken } from '../utils/hash.util';
import { generateTokens, verifyRefreshToken } from '../utils/jwt.util';
import { User, SafeUser } from '../types';
import { AppError } from '../middleware/error.middleware';
import { sendWelcomeEmail, sendVerificationEmail, sendPasswordResetEmail } from '../services/email.service';
import * as tokenService from './token.service';

// Register new user
export const register = async (
  email: string,
  password: string,
  name: string,
  phone?: string
): Promise<{ user: SafeUser; accessToken: string; refreshToken: string }> => {
  // Check if user exists
  const existingUser = await query(
    'SELECT id FROM users WHERE email = ?',
    [email]
  );

  if (existingUser.rows.length > 0) {
    throw new AppError('User with this email already exists', 409);
  }

  // Generate UUID for user
  const userId = generateToken();

  // Hash password
  const passwordHash = await hashPassword(password);

  // Generate email verification token
  const emailVerificationToken = generateToken();

  // Create user
  await query(
    `INSERT INTO users (id, email, password_hash, name, phone, role, email_verification_token, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, 'customer', ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
    [userId, email, passwordHash, name, phone || null, emailVerificationToken]
  );

  const user: User = {
    id: userId,
    email,
    password_hash: passwordHash,
    name,
    phone: phone || undefined,
    role: 'customer',
    email_verified: false,
    email_verification_token: emailVerificationToken,
    is_active: true,
    created_at: new Date(),
    updated_at: new Date(),
  };

  // Generate JWT tokens
  const tokens = generateTokens(user.id, user.email, user.role);

  // TODO: Send verification email (implement in email service)

  // Return user without sensitive data
  const { password_hash, email_verification_token, ...safeUser } = user;
  return {
    user: safeUser as SafeUser,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
};

// Login user
export const login = async (
  email: string,
  password: string
): Promise<{ user: SafeUser; accessToken: string; refreshToken: string }> => {
  // Find user
  const result = await query(
    'SELECT * FROM users WHERE email = ? AND is_active = 1',
    [email]
  );

  if (result.rows.length === 0) {
    throw new AppError('Invalid email or password', 401);
  }

  const user = result.rows[0];

  // Verify password
  const isValidPassword = await comparePassword(password, user.password_hash);
  if (!isValidPassword) {
    throw new AppError('Invalid email or password', 401);
  }

  // Update last login
  await query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);

  // Generate tokens
  const tokens = generateTokens(user.id, user.email, user.role);

  // Return user without sensitive data
  const { password_hash, email_verification_token, password_reset_token, ...safeUser } = user;
  return {
    user: safeUser as SafeUser,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
};

// Refresh token
export const refreshToken = async (
  refreshToken: string
): Promise<{ accessToken: string; refreshToken: string }> => {
  try {
    // Check if token is blacklisted
    const isBlacklisted = await tokenService.isTokenBlacklisted(refreshToken);
    if (isBlacklisted) {
      throw new AppError('Invalid refresh token', 401);
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Check if user exists and is active
    const result = await query(
      'SELECT id, email, role FROM users WHERE id = ? AND is_active = true',
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      throw new AppError('User not found or inactive', 401);
    }

    const user = result.rows[0];

    // Check if all user tokens are blacklisted
    const areAllUserTokensBlacklisted = await tokenService.areUserTokensBlacklisted(decoded.userId);
    if (areAllUserTokensBlacklisted) {
      throw new AppError('Invalid refresh token', 401);
    }

    // Blacklist the current refresh token to prevent reuse (one-time use)
    await tokenService.blacklistToken(refreshToken);

    // Generate new tokens
    const newTokens = generateTokens(user.id, user.email, user.role);

    return {
      accessToken: newTokens.accessToken,
      refreshToken: newTokens.refreshToken,
    };
  } catch (error) {
    throw new AppError('Invalid refresh token', 401);
  }
};

// Get user by ID
export const getUserById = async (userId: string): Promise<SafeUser> => {
  const result = await query(
    'SELECT id, email, name, phone, role, avatar_url, email_verified, created_at FROM users WHERE id = ?',
    [userId]
  );

  if (result.rows.length === 0) {
    throw new AppError('User not found', 404);
  }

  return result.rows[0] as SafeUser;
};

// Request password reset
export const requestPasswordReset = async (email: string): Promise<void> => {
  const result = await query(
    'SELECT id FROM users WHERE email = ?',
    [email]
  );

  if (result.rows.length === 0) {
    // Don't reveal that user doesn't exist
    return;
  }

  const user = result.rows[0];
  const resetToken = generateToken();
  const resetExpires = new Date(Date.now() + 3600000).toISOString(); // 1 hour

  await query(
    'UPDATE users SET password_reset_token = ?, password_reset_expires = ? WHERE id = ?',
    [resetToken, resetExpires, user.id]
  );

  // Send password reset email
  await sendPasswordResetEmail(email, resetToken);
};

// Reset password
export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
  const result = await query(
    'SELECT id FROM users WHERE password_reset_token = ? AND password_reset_expires > CURRENT_TIMESTAMP',
    [token]
  );

  if (result.rows.length === 0) {
    throw new AppError('Invalid or expired reset token', 400);
  }

  const user = result.rows[0];
  const passwordHash = await hashPassword(newPassword);

  await query(
    'UPDATE users SET password_hash = ?, password_reset_token = NULL, password_reset_expires = NULL WHERE id = ?',
    [passwordHash, user.id]
  );
};

// Verify email
export const verifyEmail = async (token: string): Promise<void> => {
  const result = await query(
    'SELECT id, email, name FROM users WHERE email_verification_token = ?',
    [token]
  );

  if (result.rows.length === 0) {
    throw new AppError('Invalid verification token', 400);
  }

  const user = result.rows[0];

  await query(
    'UPDATE users SET email_verified = 1, email_verification_token = NULL WHERE id = ?',
    [user.id]
  );

  // Send welcome email after successful verification
  await sendWelcomeEmail(user.email, user.name);
};

// Change password
export const changePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  const result = await query(
    'SELECT password_hash FROM users WHERE id = ?',
    [userId]
  );

  if (result.rows.length === 0) {
    throw new AppError('User not found', 404);
  }

  const user = result.rows[0];
  const isValidPassword = await comparePassword(currentPassword, user.password_hash);

  if (!isValidPassword) {
    throw new AppError('Current password is incorrect', 401);
  }

  const passwordHash = await hashPassword(newPassword);
  await query('UPDATE users SET password_hash = ? WHERE id = ?', [passwordHash, userId]);
};
