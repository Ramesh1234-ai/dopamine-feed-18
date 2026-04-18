import { Image } from '../models/Image.js';
import cloudinaryService from '../services/cloudinaryService.js';
/**
 * Upload a new image
 */
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { title, description, category } = req.body;
    const userId = req.user.id;

    // Upload to Cloudinary
    const cloudinaryResult = await cloudinaryService.uploadImage(req.file);

    // Save image metadata to database
    const newImage = await Image.create({
      userId,
      title: title || "Untitled",
      description: description || "",
      category: category || "General",
      imageUrl: cloudinaryResult.secure_url,
      cloudinaryId: cloudinaryResult.public_id,
      likes: [],
      isPublic: true
    });

    res.status(201).json({
      success: true,
      message: "Image uploaded successfully",
      image: newImage
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to upload image",
      message: error.message
    });
  }
};

/**
 * Get user's uploaded images
 */
export const getMyUploads = async (req, res) => {
  try {
    const userId = req.user.id;

    const images = await Image.find({ userId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: images.length,
      images
    });
  } catch (error) {
    console.error("Error fetching user uploads:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch uploads",
      message: error.message
    });
  }
};

/**
 * Get image by ID
 */
export const getImageById = async (req, res) => {
  try {
    const { id } = req.params;

    const image = await Image.findById(id)
      .populate("userId", "username email");

    if (!image) {
      return res.status(404).json({
        success: false,
        error: "Image not found"
      });
    }

    res.json({
      success: true,
      image
    });
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch image",
      message: error.message
    });
  }
};

/**
 * Get public gallery images
 */
export const getPublicImages = async (req, res) => {
  try {
    const { page = 1, limit = 20, category } = req.query;
    const skip = (page - 1) * limit;

    const query = { isPublic: true };
    if (category) {
      query.category = category;
    }

    const images = await Image.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate("userId", "username email");

    const total = await Image.countDocuments(query);

    res.json({
      success: true,
      count: images.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      images
    });
  } catch (error) {
    console.error("Error fetching public images:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch public images",
      message: error.message
    });
  }
};

/**
 * Toggle like on an image
 */
export const toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const image = await Image.findById(id);

    if (!image) {
      return res.status(404).json({
        success: false,
        error: "Image not found"
      });
    }

    const likeIndex = image.likes.indexOf(userId);

    if (likeIndex > -1) {
      // Unlike
      image.likes.splice(likeIndex, 1);
    } else {
      // Like
      image.likes.push(userId);
    }

    await image.save();

    res.json({
      success: true,
      message: likeIndex > -1 ? "Image unliked" : "Image liked",
      likesCount: image.likes.length,
      image
    });
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({
      success: false,
      error: "Failed to toggle like",
      message: error.message
    });
  }
};

/**
 * Delete an image
 */
export const deleteImageHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const image = await Image.findById(id);

    if (!image) {
      return res.status(404).json({
        success: false,
        error: "Image not found"
      });
    }

    // Check ownership
    if (image.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to delete this image"
      });
    }

    // Delete from Cloudinary
    if (image.cloudinaryId) {
      await cloudinaryService.deleteImage(image.cloudinaryId);
    }

    // Delete from database
    await Image.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Image deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete image",
      message: error.message
    });
  }
};
