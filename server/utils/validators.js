import sanitizeHtml from 'sanitize-html';
import slugify from 'slugify';

/**
 * Input Validation and Sanitization Utilities
 */

/**
 * Validate image title
 * @param {string} title
 * @returns {object} - { valid: boolean, error: string }
 */
const validateTitle = (title) => {
  if (!title || typeof title !== 'string') {
    return { valid: false, error: 'Title is required and must be a string' };
  }

  const trimmed = title.trim();
  
  if (trimmed.length === 0) {
    return { valid: false, error: 'Title cannot be empty' };
  }

  if (trimmed.length < 3) {
    return { valid: false, error: 'Title must be at least 3 characters' };
  }

  if (trimmed.length > 100) {
    return { valid: false, error: 'Title must not exceed 100 characters' };
  }

  return { valid: true };
};

/**
 * Validate image description
 * @param {string} description
 * @returns {object}
 */
const validateDescription = (description) => {
  if (!description) {
    return { valid: true }; // Optional field
  }

  if (typeof description !== 'string') {
    return { valid: false, error: 'Description must be a string' };
  }

  if (description.length > 500) {
    return { valid: false, error: 'Description must not exceed 500 characters' };
  }

  return { valid: true };
};

/**
 * Validate tags
 * @param {array|string} tags
 * @returns {object}
 */
const validateTags = (tags) => {
  if (!tags) {
    return { valid: true, tags: [] }; // Optional field
  }

  let tagArray;

  // Convert comma-separated string to array
  if (typeof tags === 'string') {
    tagArray = tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
  } else if (Array.isArray(tags)) {
    tagArray = tags.map(tag => String(tag).trim()).filter(tag => tag.length > 0);
  } else {
    return { valid: false, error: 'Tags must be an array or comma-separated string' };
  }

  // Validate individual tags
  const validTags = tagArray.filter(tag => {
    return tag.length > 0 && tag.length <= 30;
  });

  if (validTags.length > 10) {
    return { valid: false, error: 'Maximum 10 tags allowed' };
  }

  return { valid: true, tags: validTags };
};

/**
 * Validate category
 * @param {string} category
 * @returns {object}
 */
const validateCategory = (category) => {
  const allowedCategories = [
    'abstract',
    'landscape',
    'portrait',
    'still-life',
    'digital-art',
    'photography',
    'other',
  ];

  if (!category) {
    return { valid: true, category: 'other' }; // Default category
  }

  if (!allowedCategories.includes(category)) {
    return {
      valid: false,
      error: `Category must be one of: ${allowedCategories.join(', ')}`,
    };
  }

  return { valid: true, category };
};

/**
 * Validate adult content checkbox
 * @param {boolean} isAdultContent
 * @returns {object}
 */
const validateAdultContent = (isAdultContent) => {
  const confirmed = isAdultContent === true || isAdultContent === 'true';

  // Note: This is for confirming the checkbox, not about the actual content
  // Actual adult content detection happens in AI moderation
  return { valid: true, confirmed };
};

/**
 * Sanitize user input to prevent XSS
 * @param {string} text
 * @returns {string}
 */
const sanitizeInput = (text) => {
  if (!text || typeof text !== 'string') {
    return '';
  }

  // Remove HTML tags and dangerous content
  return sanitizeHtml(text, {
    allowedTags: [],
    allowedAttributes: {},
  })
    .trim()
    .substring(0, 1000); // Also limit length
};

/**
 * Generate SEO-friendly slug from title
 * @param {string} title
 * @returns {string}
 */
const generateSlug = (title) => {
  if (!title) return '';

  return slugify(title, {
    lower: true,
    strict: true,
    trim: true,
    replacement: '-',
  });
};

/**
 * Validate entire upload form data
 * @param {object} formData
 * @returns {object}
 */
const validateUploadForm = (formData) => {
  const errors = [];

  // Validate title
  const titleValidation = validateTitle(formData.title);
  if (!titleValidation.valid) {
    errors.push(titleValidation.error);
  }

  // Validate description
  const descValidation = validateDescription(formData.description);
  if (!descValidation.valid) {
    errors.push(descValidation.error);
  }

  // Validate tags
  const tagsValidation = validateTags(formData.tags);
  if (!tagsValidation.valid) {
    errors.push(tagsValidation.error);
  }

  // Validate category
  const categoryValidation = validateCategory(formData.category);
  if (!categoryValidation.valid) {
    errors.push(categoryValidation.error);
  }

  // Validate adult content checkbox
  const adultContentValidation = validateAdultContent(formData.isAdultContent);
  if (!adultContentValidation.valid) {
    errors.push(adultContentValidation.error);
  }

  if (errors.length > 0) {
    return {
      valid: false,
      errors,
    };
  }

  return {
    valid: true,
    data: {
      title: sanitizeInput(formData.title),
      description: sanitizeInput(formData.description || ''),
      tags: tagsValidation.tags,
      category: categoryValidation.category,
      isAdultContent: adultContentValidation.confirmed,
    },
  };
};

export {
  validateTitle,
  validateDescription,
  validateTags,
  validateCategory,
  validateAdultContent,
  sanitizeInput,
  generateSlug,
  validateUploadForm,
};
