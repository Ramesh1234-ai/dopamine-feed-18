import express from 'express';
import { verifyToken, verifyTokenOptional } from '../middleware/authMiddleware.js';
import  {uploadLimiter}  from '../middleware/rateLimiter.js';
import{ upload, validateUploadedFile, handleUploadError } from '../middleware/uploadMiddleware.js';
import {
  uploadImage,
  getMyUploads,
  getImageById,
  getPublicImages,
  toggleLike,
  deleteImageHandler,
} from'../controllers/uploadController.js';
const router = express.Router();
/**
 * Image Upload Routes
 * Base path: /api/images
 */

// Upload image (authenticated, rate-limited)
router.post(
  '/upload',
  verifyToken, // Require authentication
  uploadLimiter, // Rate limit: 5 uploads per minute
  upload.single('file'), // Multer middleware: expect single 'file' field
  handleUploadError, // Handle multer errors
  validateUploadedFile, // Validate uploaded file
  uploadImage // Main handler
);
// Get user's uploads (authenticated)
router.get('/my-uploads', verifyToken, getMyUploads);
// Get public gallery images (optional auth for tracking)
router.get('/gallery/public', verifyTokenOptional, getPublicImages);
// Get image by ID
router.get('/:id', getImageById);
// Like/unlike image (authenticated)
router.post('/:id/like', verifyToken, toggleLike);
// Delete image (authenticated, ownership required)
router.delete('/:id', verifyToken, deleteImageHandler);
export  default router;
