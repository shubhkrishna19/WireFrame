// ============================================
// PRODUCT ROUTES
// ============================================

import { Router } from 'express';
import * as productController from '../controllers/product.controller';
import { authenticate, requireAdminOrEditor } from '../middleware/auth.middleware';
import { validateBody, validateParams, commonSchemas } from '../middleware/validation.middleware';
import { z } from 'zod';

const router = Router();

// Validation schemas
const createProductSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters'),
  description: z.string().optional(),
  short_description: z.string().optional(),
  category_id: z.string().uuid().optional(),
  brand: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  original_price: z.number().positive().optional(),
  sku: z.string().min(1, 'SKU is required'),
  stock: z.number().int().min(0, 'Stock cannot be negative'),
  thumbnail_url: z.string().url().optional(),
  is_featured: z.boolean().optional(),
  fit_type: z.string().optional(),
  design: z.string().optional(),
  sleeve: z.string().optional(),
  neck: z.string().optional(),
  type: z.string().optional(),
  offer: z.string().optional(),
  specifications: z.any().optional(),
  tags: z.array(z.string()).optional(),
});

const updateProductSchema = createProductSchema.partial();

// Public routes
router.get('/', productController.getProducts);
router.get('/search', productController.searchProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/category/:slug', productController.getProductsByCategory);
router.get('/slug/:slug', productController.getProductBySlug);
router.get('/:id', validateParams(commonSchemas.uuid), productController.getProductById);
router.get('/:id/images', validateParams(commonSchemas.uuid), productController.getProductImages);
router.get('/:id/variants', validateParams(commonSchemas.uuid), productController.getProductVariants);

// Protected routes (admin/editor only)
router.post(
  '/',
  authenticate,
  requireAdminOrEditor,
  validateBody(createProductSchema),
  productController.createProduct
);

router.put(
  '/:id',
  authenticate,
  requireAdminOrEditor,
  validateParams(commonSchemas.uuid),
  validateBody(updateProductSchema),
  productController.updateProduct
);

router.delete(
  '/:id',
  authenticate,
  requireAdminOrEditor,
  validateParams(commonSchemas.uuid),
  productController.deleteProduct
);

export default router;

