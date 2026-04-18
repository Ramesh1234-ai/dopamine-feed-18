import multer from 'multer';
import cloudinary from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

/**
 * Configure Cloudinary
 */
export { cloudinary };

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Storage strategy using Cloudinary
 */
export const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ai-gallery', // Cloudinary folder path
    resource_type: 'auto',
    format: async (req, file) => {
      return 'jpg'; // Convert all images to jpg
    },
    public_id: (req, file) => {
      // Generate unique ID with timestamp and random string
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      return `${req.userId}-${uniqueSuffix}`;
    },
  },
});

/**
 * File filter - only allow image types
 */
export const fileFilter = (req, file, cb) => {
  // Allowed image MIME types
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file type. Only JPEG, PNG, and WebP images are allowed. Received: ${file.mimetype}`
      ),
      false
    );
  }
};

/**
 * File size limits
 * Max: 10MB
 */
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB in bytes
  },
});

/**
 * Middleware to validate uploaded file
 */
export const validateUploadedFile = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded.',
    });
  }

  // File will have size in bytes
  if (req.file.size > 10 * 1024 * 1024) {
    // Delete from Cloudinary if somehow it exceeded the limit
    cloudinary.uploader.destroy(req.file.public_id, (error) => {
      if (error) console.error('Error deleting oversized file:', error);
    });

    return res.status(413).json({
      success: false,
      message: 'File size exceeds maximum limit of 10MB.',
    });
  }

  // Check MIME type
  if (!['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(req.file.mimetype)) {
    cloudinary.uploader.destroy(req.file.public_id, (error) => {
      if (error) console.error('Error deleting invalid file:', error);
    });

    return res.status(400).json({
      success: false,
      message: 'Invalid file type. Only JPEG, PNG, and WebP images are allowed.',
    });
  }

  next();
};

/**
 * Handle multer errors
 */
export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        success: false,
        message: 'File size exceeds maximum limit of 10MB.',
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Maximum file limit exceeded.',
      });
    }
  }

  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message || 'File upload error.',
    });
  }

  next();
};
