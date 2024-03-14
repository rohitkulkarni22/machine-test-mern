// authMiddleware.js

const jwt = require('jsonwebtoken');
const { verifyAuthToken } = require('../service/auth');

// Middleware function to verify JWT token
const requireAuth = async (req, res, next) => {
  try {
    // Extract JWT token from cookies
    const token = req.cookies.authToken;

    // Check if token is present
    if (!token) {
      return res.status(401).json({ error: 'Authorization token is required' });
    }

    // Verify the token
    const userId = await verifyAuthToken(token);

    // If token is valid, set the user ID in the request object
    req.userId = userId;

    // Proceed to the next middleware
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(401).json({ error: 'Invalid authorization token' });
  }
};

module.exports = requireAuth;
