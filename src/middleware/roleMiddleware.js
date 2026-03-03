const { sendError } = require('../utils/apiResponse');

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 'Not authorized', 401);
    }
    if (!roles.includes(req.user.role)) {
      return sendError(res, `Access denied. Required role: ${roles.join(' or ')}`, 403);
    }
    next();
  };
};

module.exports = { authorize };
