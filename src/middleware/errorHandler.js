const { sendError } = require('../utils/apiResponse');
const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join('. ');
  }

  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid resource ID';
  }

  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    message = `${field} already exists`;
  }

  if (process.env.NODE_ENV !== 'production') {
    logger.error('Error:', err.stack);
  } else {
    logger.error('Error:', message);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

const notFound = (req, res) => {
  sendError(res, `Not found - ${req.originalUrl}`, 404);
};

module.exports = { errorHandler, notFound };
