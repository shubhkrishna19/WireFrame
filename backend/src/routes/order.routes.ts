// ============================================
// ORDER ROUTES
// ============================================

import { Router } from 'express';
import * as orderController from '../controllers/order.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';
import { validateBody, validateParams, commonSchemas } from '../middleware/validation.middleware';
import { z } from 'zod';

const router = Router();

// Validation schemas
const createOrderSchema = z.object({
  items: z.array(z.object({
    product_id: z.string().uuid(),
    variant_id: z.string().uuid().optional(),
    quantity: z.number().int().min(1),
    selected_size: z.string().optional(),
    selected_color: z.string().optional(),
  })),
  shipping_address: z.object({
    full_name: z.string(),
    phone: z.string(),
    street: z.string(),
    city: z.string(),
    state: z.string(),
    postal_code: z.string(),
    country: z.string().default('India'),
  }),
  billing_address: z.object({
    full_name: z.string(),
    phone: z.string(),
    street: z.string(),
    city: z.string(),
    state: z.string(),
    postal_code: z.string(),
    country: z.string().default('India'),
  }).optional(),
  payment_method: z.string(),
  coupon_code: z.string().optional(),
});

const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']),
});

const guestOrderSchema = createOrderSchema.extend({
  guestEmail: z.string().email(),
  guestSessionId: z.string(),
});

const linkGuestOrdersSchema = z.object({
  guestEmail: z.string().email(),
});

// Guest routes (no authentication required)
router.post('/guest', validateBody(guestOrderSchema), orderController.createGuestOrder);
router.get('/guest/session/:sessionId', orderController.getGuestSessionOrders);

// Customer routes (authentication required)
router.use(authenticate);
router.post('/', validateBody(createOrderSchema), orderController.createOrder);
router.get('/', orderController.getUserOrders);
router.get('/:id', validateParams(commonSchemas.uuid), orderController.getOrderById);
router.put('/:id/cancel', validateParams(commonSchemas.uuid), orderController.cancelOrder);
router.post('/link-guest-orders', validateBody(linkGuestOrdersSchema), orderController.linkGuestOrders);

// Admin routes
router.get('/admin/all', requireAdmin, orderController.getAllOrders);
router.put('/admin/:id/status', requireAdmin, validateParams(commonSchemas.uuid), validateBody(updateOrderStatusSchema), orderController.updateOrderStatus);

export default router;

