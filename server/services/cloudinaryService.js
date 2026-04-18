import { cloudinary } from '../middleware/uploadMiddleware.js';
/**
 * Cloudinary Service
 * Handles all Cloudinary-related operations
 */
/**
 * Upload image to Cloudinary
 * File is already uploaded via multer middleware
 * @param {object} file - Multer file object
 * @returns {object}
 */
const uploadImage = async (file) => {
  try {
    // File is already uploaded via multer CloudinaryStorage middleware
    // Return the file info
    return {
      secure_url: file.path,
      public_id: file.filename,
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};
/**
 * Delete image from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @returns {Promise}
 */
const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw error;
  }
};
/**
 * Get image details from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @returns {Promise}
 */
const getImageDetails = async (publicId) => {
  try {
    const result = await cloudinary.api.resource(publicId);
    return result;
  } catch (error) {
    console.error('Error getting image details from Cloudinary:', error);
    throw error;
  }
};
/**
 * Generate optimized image URL for different use cases
 * @param {string} publicId - Cloudinary public ID
 * @param {string} type - 'thumbnail', 'medium', 'large'
 * @returns {string}
 */
const getOptimizedUrl = (publicId, type = 'medium') => {
  const sizes = {
    thumbnail: 'w_200,h_200,c_fill,q_auto:best',
    medium: 'w_500,h_500,c_limit,q_auto:good',
    large: 'w_1200,h_1200,c_limit,q_auto:best',
    display: 'w_800,h_800,c_limit,q_auto:best',
  };
  const transformation = sizes[type] || sizes.medium;
  return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${transformation}/${publicId}`;
};
/**
 * Create secure signed URL (for private images)
 * @param {string} publicId - Cloudinary public ID
 * @returns {string}
 */
const getSecureUrl = (publicId) => {
  return cloudinary.url(publicId, {
    secure: true,
    sign_url: true,
    type: 'authenticated',
    transformation: [{ quality: 'auto:best' }],
  });
};
/**
 * Extract public ID from Cloudinary URL
 * @param {string} url - Cloudinary URL
 * @returns {string}
 */
const extractPublicId = (url) => {
  try {
    // Extract public ID from URL
    // Format: https://res.cloudinary.com/{cloud_name}/image/upload/{public_id}
    const regex = /\/upload\/(?:.+?\/)*(.+?)(?:\..+)?$/;
    const match = url.match(regex);
    return match ? match[1] : null;
  } catch (error) {
    console.error('Error extracting public ID:', error);
    return null;
  }
};

export default {
  uploadImage,
  deleteImage,
  getImageDetails,
  getOptimizedUrl,
  getSecureUrl,
  extractPublicId,
};
