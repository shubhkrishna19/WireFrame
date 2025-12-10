// ============================================
// USER ROUTES
// ============================================

import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateBody, validateParams, commonSchemas } from '../middleware/validation.middleware';
import { z } from 'zod';

const router = Router();

const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  avatar_url: z.string().url().optional(),
});

const addressSchema = z.object({
  full_name: z.string().min(2),
  phone: z.string(),
  street: z.string(),
  city: z.string(),
  state: z.string(),
  postal_code: z.string(),
  country: z.string().default('India'),
  is_default: z.boolean().optional(),
  address_type: z.string().optional(),
});

router.use(authenticate);

router.get('/profile', userController.getProfile);
router.put('/profile', validateBody(updateProfileSchema), userController.updateProfile);
router.get('/addresses', userController.getAddresses);
router.post('/addresses', validateBody(addressSchema), userController.addAddress);
router.put('/addresses/:id', validateParams(commonSchemas.uuid), validateBody(addressSchema.partial()), userController.updateAddress);
router.delete('/addresses/:id', validateParams(commonSchemas.uuid), userController.deleteAddress);

export default router;

