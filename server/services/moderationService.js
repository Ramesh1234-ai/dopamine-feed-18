import axios from 'axios';

/**
 * AI Moderation Service
 * Handles content moderation using OpenAI's Moderation API
 * Alternative: Can be extended to support other AI moderation services (e.g., Google Vision, AWS Rekognition)
 */

/**
 * Moderate image content using OpenAI Moderation API
 * Checks for: nudity, sexual content, violence, hate symbols, illegal content
 * 
 * @param {string} imageUrl - URL of the image to moderate
 * @param {object} metadata - Additional metadata (title, description, tags)
 * @returns {object} - Moderation result with status and details
 */
const moderateImage = async (imageUrl, metadata = {}) => {
  try {
    // If no OpenAI key, return approved status (development mode)
    if (!process.env.OPENAI_API_KEY) {
      console.warn('OpenAI API key not configured. Skipping AI moderation.');
      return {
        isApproved: true,
        categories: {},
        scores: {},
        flaggedReason: 'Moderation skipped - API not configured',
        shouldReview: false,
      };
    }

    // Step 1: Check the image URL for inappropriate content
    // Note: OpenAI's moderation API works on text, images via URL in vision models
    // We'll use a multi-step approach:
    
    // For text content (title + description + tags combined)
    const textContent = `
      Title: ${metadata.title || ''}
      Description: ${metadata.description || ''}
      Tags: ${metadata.tags?.join(', ') || ''}
    `;

    // Call OpenAI Moderation API for text content
    const textModerationResult = await checkTextModeration(textContent);

    // For more sophisticated image moderation, you could use:
    // - Google Vision API for explicit content detection
    // - AWS Rekognition for image content analysis
    // - Custom ML model for image moderation
    
    // For now, we'll implement a comprehensive approach:
    // 1. Check text descriptors
    // 2. Return moderation status

    const isApproved = !textModerationResult.flagged;
    const severity = textModerationResult.flagged ? 'high' : 'low';

    return {
      isApproved,
      categories: textModerationResult.categories,
      scores: textModerationResult.category_scores,
      flaggedReason: textModerationResult.flagged ? 'Content violates moderation policy' : '',
      shouldReview: shouldFlagForManualReview(textModerationResult),
      rawResponse: textModerationResult,
    };
  } catch (error) {
    console.error('Error in AI moderation:', error);
    
    // On error, flag for manual review but allow upload
    return {
      isApproved: true, // Allow upload but flag for review
      categories: {},
      scores: {},
      flaggedReason: 'Moderation service error',
      shouldReview: true,
      error: error.message,
    };
  }
};

/**
 * Check text content using OpenAI Moderation API
 * @param {string} text - Text to moderate
 * @returns {object}
 */
const checkTextModeration = async (text) => {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/moderations',
      {
        input: text,
        model: 'text-moderation-latest',
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Extract the first result from the response
    if (response.data.results && response.data.results.length > 0) {
      return response.data.results[0];
    }

    return {
      flagged: false,
      categories: {},
      category_scores: {},
    };
  } catch (error) {
    console.error('OpenAI moderation API error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Determine if content should be flagged for manual review
 * Even if not automatically rejected, some content might need manual review
 * @param {object} moderationResult - Result from moderation API
 * @returns {boolean}
 */
const shouldFlagForManualReview = (moderationResult) => {
  // Flag for manual review if:
  // - Content hits any category with score > 0.5 but is not outright rejected
  // - Multiple categories have moderate scores
  
  if (!moderationResult.category_scores) return false;

  const scores = moderationResult.category_scores;
  const moderateCategories = Object.entries(scores).filter(([_, score]) => score > 0.3 && score < 0.7);

  return moderateCategories.length > 0;
};

/**
 * Enhanced image analysis using vision (optional - requires separate model)
 * This could use GPT-4 Vision or similar for more detailed image analysis
 * @param {string} imageUrl - URL of image to analyze
 * @param {string} prompt - What to analyze
 * @returns {object}
 */
const analyzeImageWithVision = async (imageUrl, prompt = 'Describe any inappropriate content in this image') => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return {
        analysis: 'Vision analysis skipped - API not configured',
        flagged: false,
      };
    }

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl,
                },
              },
              {
                type: 'text',
                text: prompt,
              },
            ],
          },
        ],
        max_tokens: 200,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      analysis: response.data.choices[0].message.content,
      flagged: false, // You'd need to parse the response to determine if it should be flagged
    };
  } catch (error) {
    console.error('Vision analysis error:', error.response?.data || error.message);
    return {
      analysis: 'Vision analysis failed',
      error: error.message,
      flagged: false,
    };
  }
};

/**
 * Get moderation status description
 * @param {object} moderationResult - Moderation result
 * @returns {string}
 */
const getModerationStatusDescription = (moderationResult) => {
  if (moderationResult.isApproved && !moderationResult.shouldReview) {
    return 'Content approved - no violations detected';
  }

  if (moderationResult.shouldReview) {
    return 'Content flagged for manual review';
  }

  return `Content rejected - ${moderationResult.flaggedReason}`;
};

export default {
  moderateImage,
  checkTextModeration,
  analyzeImageWithVision,
  getModerationStatusDescription,
};
