// ============================================
// UPLOAD ROUTES
// ============================================

import { Router } from 'express';
import multer from 'multer';
import * as uploadController from '../controllers/upload.controller';
import { authenticate, requireAdminOrEditor } from '../middleware/auth.middleware';
import { uploadLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG and WebP are allowed.'));
    }
  },
});

// All routes require authentication
router.use(authenticate);
router.use(uploadLimiter);

// Upload routes
router.post('/image', requireAdminOrEditor, upload.single('image'), uploadController.uploadImage);
router.post('/images', requireAdminOrEditor, upload.array('images', 10), uploadController.uploadMultipleImages);
router.post('/avatar', upload.single('avatar'), uploadController.uploadAvatar);
router.delete('/image', requireAdminOrEditor, uploadController.deleteImage);

export default router;

