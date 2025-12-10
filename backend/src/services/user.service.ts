// ============================================
// USER SERVICE
// ============================================

import { query } from '../config/database';
import { SafeUser, Address } from '../types';
import { AppError } from '../middleware/error.middleware';

export const getUserById = async (userId: string): Promise<SafeUser> => {
  const result = await query<SafeUser>(
    'SELECT id, email, name, phone, role, avatar_url, email_verified, created_at FROM users WHERE id = ?',
    [userId]
  );
  if (result.rows.length === 0) throw new AppError('User not found', 404);
  return result.rows[0];
};

export const updateProfile = async (userId: string, data: any): Promise<SafeUser> => {
  const updates: string[] = [];
  const params: any[] = [];
  let paramIndex = 1;

  const allowedFields = ['name', 'phone', 'avatar_url'];
  Object.keys(data).forEach(key => {
    if (allowedFields.includes(key) && data[key] !== undefined) {
      updates.push(`${key} = $${paramIndex++}`);
      params.push(data[key]);
    }
  });

  if (updates.length === 0) return getUserById(userId);

  params.push(userId);
  const result = await query<SafeUser>(
    `UPDATE users SET ${updates.join(', ')}, updated_at = datetime('now') WHERE id = $${paramIndex}
     RETURNING id, email, name, phone, role, avatar_url, email_verified, created_at`,
    params
  );
  return result.rows[0];
};

export const getAddresses = async (userId: string): Promise<Address[]> => {
  const result = await query<Address>(
    'SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, created_at DESC',
    [userId]
  );
  return result.rows;
};

export const addAddress = async (userId: string, data: any): Promise<Address> => {
  const { full_name, phone, street, city, state, postal_code, country, is_default, address_type } = data;

  // If setting as default, unset other defaults
  if (is_default) {
    await query('UPDATE addresses SET is_default = false WHERE user_id = ?', [userId]);
  }

  const result = await query<Address>(
    `INSERT INTO addresses (user_id, full_name, phone, street, city, state, postal_code, country, is_default, address_type, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now')) RETURNING *`,
    [userId, full_name, phone, street, city, state, postal_code, country || 'India', is_default || false, address_type]
  );
  return result.rows[0];
};

export const updateAddress = async (userId: string, addressId: string, data: any): Promise<Address> => {
  const check = await query('SELECT id FROM addresses WHERE id = ? AND user_id = ?', [addressId, userId]);
  if (check.rows.length === 0) throw new AppError('Address not found', 404);

  if (data.is_default) {
    await query('UPDATE addresses SET is_default = false WHERE user_id = ? AND id != ?', [userId, addressId]);
  }

  const updates: string[] = [];
  const params: any[] = [];
  let paramIndex = 1;

  const allowedFields = ['full_name', 'phone', 'street', 'city', 'state', 'postal_code', 'country', 'is_default', 'address_type'];
  Object.keys(data).forEach(key => {
    if (allowedFields.includes(key) && data[key] !== undefined) {
      updates.push(`${key} = $${paramIndex++}`);
      params.push(data[key]);
    }
  });

  if (updates.length === 0) {
    return (await query<Address>('SELECT * FROM addresses WHERE id = ?', [addressId])).rows[0];
  }

  params.push(addressId);
  const result = await query<Address>(
    `UPDATE addresses SET ${updates.join(', ')}, updated_at = datetime('now') WHERE id = $${paramIndex} RETURNING *`,
    params
  );
  return result.rows[0];
};

export const deleteAddress = async (userId: string, addressId: string): Promise<void> => {
  const result = await query('DELETE FROM addresses WHERE id = ? AND user_id = ?', [addressId, userId]);
  if ((result.rowCount || 0) === 0) throw new AppError('Address not found', 404);
};
