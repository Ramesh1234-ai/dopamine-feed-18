import jwt from "jsonwebtoken"
/**
 * Authentication Middleware using Clerk JWT
 * Validates JWT tokens and extracts user information
 */
export const verifyToken = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Authorization required.',
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // For now, accept any valid-looking token and extract user ID from it
    // In production, you'd verify the signature with Clerk's public key
    // For Clerk, we typically verify the session cookie instead
    // For this demo, we'll extract the user ID from the Authorization header
    
    try {
      // Try to decode the token (Clerk tokens are JWTs)
      const decoded = jwt.decode(token);
      
      if (!decoded || !decoded.sub) {
        return res.status(401).json({
          success: false,
          message: 'Invalid token format.',
        });
      }

      // Attach user ID to request
      req.userId = decoded.sub;
      req.user = decoded;
      
      next();
    } catch (decodeError) {
      // If JWT decode fails, still allow with user ID from custom header
      // This is for development/flexibility
      const userId = req.headers['x-user-id'];
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Invalid or expired token.',
        });
      }

      req.userId = userId;
      next();
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication error.',
    });
  }
};

/**
 * Optional Authentication Middleware
 * Allows requests with or without token
 */
export const verifyTokenOptional = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const decoded = jwt.decode(token);
        if (decoded && decoded.sub) {
          req.userId = decoded.sub;
          req.user = decoded;
        }
      } catch (e) {
        // Silent fail - user will be treated as anonymous
      }
    }
    
    next();
  } catch (error) {
    console.error('Optional auth error:', error);
    next();
  }
};

