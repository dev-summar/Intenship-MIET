const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendError } = require('../utils/apiResponse');
const logger = require('../utils/logger');

const protect = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return sendError(res, 'Not authorized to access this route', 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return sendError(res, 'User not found', 401);
    }
    req.user = user;
    next();
  } catch (error) {
    logger.error('Auth middleware error:', error.message);
    if (error.name === 'TokenExpiredError') {
      return sendError(res, 'Token expired. Please login again', 401);
    }
    if (error.name === 'JsonWebTokenError') {
      return sendError(res, 'Invalid token', 401);
    }
    return sendError(res, 'Not authorized to access this route', 401);
  }
};

module.exports = { protect };
