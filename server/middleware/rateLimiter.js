import rateLimit from 'express-rate-limit';
/**
 * Rate limiting for file uploads
 * Max 5 uploads per user per minute
 */
export const uploadLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5, // 5 requests per windowMs per user
  
  // Use user ID to track rate limits per user
  keyGenerator: (req, res) => {
    return req.userId || req.ip;
  },
  
  skip: (req, res) => {
    // Don't rate limit admin users (optional)
    return false;
  },
  
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many upload requests. Maximum 5 uploads per minute allowed.',
      retryAfter: req.rateLimit.resetTime,
    });
  },

  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

/**
 * Rate limiting for general API endpoints
 * Max 30 requests per minute per IP
 */
export const generalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30,
  
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many requests. Please try again later.',
    });
  },

  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limit for moderation API calls (to avoid excessive AI API costs)
 */
export const moderationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // 100 moderation checks per hour
  
  keyGenerator: (req, res) => {
    return req.userId || req.ip;
  },

  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Moderation rate limit exceeded. Please try again later.',
    });
  },

  standardHeaders: true,
  legacyHeaders: false,
});
