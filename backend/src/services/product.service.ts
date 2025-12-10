// ============================================
// PRODUCT SERVICE
// ============================================

import { query } from '../config/database';
import { Product, ProductImage, ProductVariant, ProductFilters, PaginationParams, PaginatedResponse } from '../types';
import { AppError } from '../middleware/error.middleware';

// Get products with filters and pagination
export const getProducts = async (
  filters: ProductFilters,
  pagination: PaginationParams
): Promise<PaginatedResponse<Product>> => {
  const { page = 1, limit = 20, sort = 'created_at', order = 'desc' } = pagination;
  const offset = (page - 1) * limit;

  // Build WHERE clause
  const conditions: string[] = ['is_active = true'];
  const params: any[] = [];

  if (filters.category) {
    params.push(filters.category);
    conditions.push(`category_id = ?`);
  }

  if (filters.brand) {
    params.push(filters.brand);
    conditions.push(`brand = ?`);
  }

  if (filters.minPrice) {
    params.push(filters.minPrice);
    conditions.push(`price >= ?`);
  }

  if (filters.maxPrice) {
    params.push(filters.maxPrice);
    conditions.push(`price <= ?`);
  }

  if (filters.rating) {
    params.push(filters.rating);
    conditions.push(`rating >= ?`);
  }

  if (filters.search) {
    const searchPattern = `%${filters.search}%`;
    params.push(searchPattern, searchPattern);
    conditions.push(`(name LIKE ? OR description LIKE ?)`);
  }

  if (filters.inStock) {
    conditions.push('stock > 0');
  }

  if (filters.isFeatured) {
    conditions.push('is_featured = true');
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  // Get total count
  const countResult = await query(
    `SELECT COUNT(*) as count FROM products ${whereClause}`,
    params
  );
  const total = parseInt(countResult.rows[0].count, 10);

  // Get products – use a fresh params array to avoid mutating the original filter params
  const productParams = [...params, limit, offset];
  const productsResult = await query<Product>(
    `SELECT * FROM products ${whereClause} 
     ORDER BY ${sort} ${order} 
     LIMIT ? OFFSET ?`,
    productParams
  );

  return {
    data: productsResult.rows,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Get product by ID
export const getProductById = async (id: string): Promise<Product | null> => {
  const result = await query<Product>(
    'SELECT * FROM products WHERE id = ?',
    [id]
  );
  return result.rows[0] || null;
};

// Get product by slug
export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  const result = await query<Product>(
    'SELECT * FROM products WHERE slug = ?',
    [slug]
  );
  return result.rows[0] || null;
};

// Create product
export const createProduct = async (data: any): Promise<Product> => {
  const {
    name, slug, description, short_description, category_id, brand,
    price, original_price, sku, stock, thumbnail_url, is_featured,
    fit_type, design, sleeve, neck, type, offer, specifications, tags
  } = data;

  const result = await query<Product>(
    `INSERT INTO products (
      name, slug, description, short_description, category_id, brand,
      price, original_price, discount_percentage, sku, stock, thumbnail_url,
      is_featured, fit_type, design, sleeve, neck, type, offer,
      specifications, tags, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    RETURNING *`,
    [
      name, slug, description, short_description, category_id, brand,
      price, original_price,
      original_price ? Math.round(((original_price - price) / original_price) * 100) : null,
      sku, stock, thumbnail_url, is_featured || false,
      fit_type, design, sleeve, neck, type, offer,
      specifications ? JSON.stringify(specifications) : null,
      tags || null
    ]
  );

  return result.rows[0];
};

// Update product
export const updateProduct = async (id: string, data: any): Promise<Product | null> => {
  const updates: string[] = [];
  const params: any[] = [];
  let paramIndex = 1;

  const allowedFields = [
    'name', 'slug', 'description', 'short_description', 'category_id', 'brand',
    'price', 'original_price', 'sku', 'stock', 'thumbnail_url', 'is_active',
    'is_featured', 'fit_type', 'design', 'sleeve', 'neck', 'type', 'offer',
    'specifications', 'tags'
  ];

  Object.keys(data).forEach((key) => {
    if (allowedFields.includes(key) && data[key] !== undefined) {
      updates.push(`${key} = $${paramIndex++}`);
      params.push(data[key]);
    }
  });

  if (updates.length === 0) {
    return getProductById(id);
  }

  // Calculate discount percentage if both prices provided
  if (data.price && data.original_price) {
    updates.push(`discount_percentage = $${paramIndex++}`);
    params.push(Math.round(((data.original_price - data.price) / data.original_price) * 100));
  }

  updates.push(`updated_at = datetime('now')`);
  params.push(id);

  const result = await query<Product>(
    `UPDATE products SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
    params
  );

  return result.rows[0] || null;
};

// Delete product
export const deleteProduct = async (id: string): Promise<boolean> => {
  const result = await query(
    'DELETE FROM products WHERE id = ?',
    [id]
  );
  return (result.rowCount || 0) > 0;
};

// Get product images
export const getProductImages = async (productId: string): Promise<ProductImage[]> => {
  const result = await query<ProductImage>(
    'SELECT * FROM product_images WHERE product_id = ? ORDER BY display_order, created_at',
    [productId]
  );
  return result.rows;
};

// Get product variants
export const getProductVariants = async (productId: string): Promise<ProductVariant[]> => {
  const result = await query<ProductVariant>(
    'SELECT * FROM product_variants WHERE product_id = ?',
    [productId]
  );
  return result.rows;
};

// Search products
export const searchProducts = async (searchQuery: string, limit: number = 10): Promise<Product[]> => {
  const result = await query<Product>(
    `SELECT * FROM products 
     WHERE is_active = true 
     AND (name LIKE ? OR description LIKE ? OR tags::text LIKE ?)
     ORDER BY rating DESC, review_count DESC
     LIMIT ?`,
    [`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`, limit]
  );
  return result.rows;
};

// Get featured products
export const getFeaturedProducts = async (limit: number = 8): Promise<Product[]> => {
  const result = await query<Product>(
    `SELECT * FROM products 
     WHERE is_active = true AND is_featured = true
     ORDER BY created_at DESC
     LIMIT ?`,
    [limit]
  );
  return result.rows;
};

// Get products by category
export const getProductsByCategory = async (
  categorySlug: string,
  pagination: PaginationParams
): Promise<PaginatedResponse<Product>> => {
  // First get category ID
  const categoryResult = await query(
    'SELECT id FROM categories WHERE slug = ?',
    [categorySlug]
  );

  if (categoryResult.rows.length === 0) {
    throw new AppError('Category not found', 404);
  }

  const categoryId = categoryResult.rows[0].id;

  return getProducts({ category: categoryId } as ProductFilters, pagination);
};
