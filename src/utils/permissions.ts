import { UserRole, RolePermissions } from '../data/mockData';

/**
 * Permission definitions for each role
 */
export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  customer: {
    canViewProducts: true,
    canEditProducts: false,
    canDeleteProducts: false,
    canViewOrders: true,
    canEditOrders: false,
    canViewUsers: false,
    canEditUsers: false,
  },
  editor: {
    canViewProducts: true,
    canEditProducts: true,
    canDeleteProducts: false,
    canViewOrders: true,
    canEditOrders: true,
    canViewUsers: true,
    canEditUsers: false,
  },
  admin: {
    canViewProducts: true,
    canEditProducts: true,
    canDeleteProducts: true,
    canViewOrders: true,
    canEditOrders: true,
    canViewUsers: true,
    canEditUsers: true,
  },
};

/**
 * Check if a role has a specific permission
 */
export const hasPermission = (role: UserRole, permission: keyof RolePermissions): boolean => {
  return ROLE_PERMISSIONS[role]?.[permission] ?? false;
};

/**
 * Check if user can access admin dashboard
 */
export const canAccessAdmin = (role: UserRole): boolean => {
  return role === 'admin' || role === 'editor';
};

/**
 * Check if user can edit products
 */
export const canEditProducts = (role: UserRole): boolean => {
  return hasPermission(role, 'canEditProducts');
};

/**
 * Check if user can manage users/accounts
 */
export const canEditUsers = (role: UserRole): boolean => {
  return hasPermission(role, 'canEditUsers');
};

/**
 * Check if user can manage orders
 */
export const canManageOrders = (role: UserRole): boolean => {
  return hasPermission(role, 'canEditOrders');
};

/**
 * Check if user is a company employee (not a customer)
 */
export const isCompanyEmployee = (role: UserRole): boolean => {
  return role === 'admin' || role === 'editor';
};

