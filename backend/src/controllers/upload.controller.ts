// ============================================
// UPLOAD CONTROLLER
// ============================================

import { Response } from 'express';
import { AuthRequest } from '../types';
import * as uploadService from '../services/upload.service';
import { sendSuccess, sendError } from '../utils/response.util';
import { asyncHandler } from '../middleware/error.middleware';

// Upload single image
export const uploadImage = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.file) {
    sendError(res, 'No file uploaded', 400);
    return;
  }

  const result = await uploadService.uploadImage(req.file, req.body.folder);
  sendSuccess(res, result, 'Image uploaded successfully');
});

// Upload multiple images
export const uploadMultipleImages = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
    sendError(res, 'No files uploaded', 400);
    return;
  }

  const results = await uploadService.uploadMultipleImages(req.files, req.body.folder);
  sendSuccess(res, results, 'Images uploaded successfully');
});

// Upload avatar
export const uploadAvatar = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.file) {
    sendError(res, 'No file uploaded', 400);
    return;
  }

  const result = await uploadService.uploadAvatar(req.file);
  sendSuccess(res, result, 'Avatar uploaded successfully');
});

// Delete image
export const deleteImage = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { publicId } = req.body;

  if (!publicId) {
    sendError(res, 'Public ID is required', 400);
    return;
  }

  await uploadService.deleteImage(publicId);
  sendSuccess(res, null, 'Image deleted successfully');
});

export default {
  uploadImage,
  uploadMultipleImages,
  uploadAvatar,
  deleteImage,
};
