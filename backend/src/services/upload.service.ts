// ============================================
// FILE UPLOAD SERVICE (Cloudinary)
// ============================================

import { v2 as cloudinary } from 'cloudinary';
import { config } from '../config/env';
import { AppError } from '../middleware/error.middleware';
import { logger } from '../config/logger';

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

// Upload single image
export const uploadImage = async (
  file: Express.Multer.File,
  folder: string = 'products'
): Promise<{ url: string; publicId: string }> => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: `mulary/${folder}`,
      transformation: [
        { width: 1000, height: 1000, crop: 'limit' },
        { quality: 'auto:good' },
        { fetch_format: 'auto' },
      ],
    });

    logger.info(`Image uploaded to Cloudinary: ${result.public_id}`);

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error: any) {
    logger.error('Cloudinary upload failed:', error);
    throw new AppError(`Image upload failed: ${error.message}`, 500);
  }
};

// Upload multiple images
export const uploadMultipleImages = async (
  files: Express.Multer.File[],
  folder: string = 'products'
): Promise<Array<{ url: string; publicId: string }>> => {
  try {
    const uploadPromises = files.map(file => uploadImage(file, folder));
    return await Promise.all(uploadPromises);
  } catch (error: any) {
    logger.error('Multiple image upload failed:', error);
    throw new AppError(`Image upload failed: ${error.message}`, 500);
  }
};

// Delete image
export const deleteImage = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
    logger.info(`Image deleted from Cloudinary: ${publicId}`);
  } catch (error: any) {
    logger.error('Cloudinary delete failed:', error);
    throw new AppError(`Image deletion failed: ${error.message}`, 500);
  }
};

// Upload avatar (smaller transformation)
export const uploadAvatar = async (file: Express.Multer.File): Promise<{ url: string; publicId: string }> => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'mulary/avatars',
      transformation: [
        { width: 400, height: 400, crop: 'fill', gravity: 'face' },
        { quality: 'auto:good' },
        { fetch_format: 'auto' },
      ],
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error: any) {
    logger.error('Avatar upload failed:', error);
    throw new AppError(`Avatar upload failed: ${error.message}`, 500);
  }
};

export default {
  uploadImage,
  uploadMultipleImages,
  deleteImage,
  uploadAvatar,
};
