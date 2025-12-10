// ============================================
// PRODUCT CONTROLLER
// ============================================

import { Response } from 'express';
import { AuthRequest } from '../types';
import * as productService from '../services/product.service';
import { sendSuccess, sendCreated, sendNotFound, sendNoContent, sendPaginated } from '../utils/response.util';
import { asyncHandler } from '../middleware/error.middleware';

// Get all products with filters and pagination
export const getProducts = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { page = 1, limit = 20, sort, order, ...filters } = req.query;

  const result = await productService.getProducts(
    filters as any,
    { page: Number(page), limit: Number(limit), sort: sort as string, order: order as 'asc' | 'desc' }
  );

  sendPaginated(res, result.data, result.pagination.page, result.pagination.limit, result.pagination.total);
});

// Get single product by ID
export const getProductById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const product = await productService.getProductById(id);

  if (!product) {
    sendNotFound(res, 'Product not found');
    return;
  }

  sendSuccess(res, product);
});

// Get product by slug
export const getProductBySlug = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { slug } = req.params;
  const product = await productService.getProductBySlug(slug);

  if (!product) {
    sendNotFound(res, 'Product not found');
    return;
  }

  sendSuccess(res, product);
});

// Create new product (admin only)
export const createProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
  const product = await productService.createProduct(req.body);
  sendCreated(res, product, 'Product created successfully');
});

// Update product (admin only)
export const updateProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const product = await productService.updateProduct(id, req.body);

  if (!product) {
    sendNotFound(res, 'Product not found');
    return;
  }

  sendSuccess(res, product, 'Product updated successfully');
});

// Delete product (admin only)
export const deleteProduct = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const deleted = await productService.deleteProduct(id);

  if (!deleted) {
    sendNotFound(res, 'Product not found');
    return;
  }

  sendNoContent(res);
});

// Get product images
export const getProductImages = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const images = await productService.getProductImages(id);
  sendSuccess(res, images);
});

// Get product variants
export const getProductVariants = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const variants = await productService.getProductVariants(id);
  sendSuccess(res, variants);
});

// Search products
export const searchProducts = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { q, limit = 10 } = req.query;
  const results = await productService.searchProducts(q as string, Number(limit));
  sendSuccess(res, results);
});

// Get featured products
export const getFeaturedProducts = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { limit = 8 } = req.query;
  const products = await productService.getFeaturedProducts(Number(limit));
  sendSuccess(res, products);
});

// Get products by category
export const getProductsByCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { slug } = req.params;
  const { page = 1, limit = 20 } = req.query;

  const result = await productService.getProductsByCategory(
    slug,
    { page: Number(page), limit: Number(limit) }
  );

  sendPaginated(res, result.data, result.pagination.page, result.pagination.limit, result.pagination.total);
});
