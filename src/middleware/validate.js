const { validationResult } = require('express-validator');
const { sendError } = require('../utils/apiResponse');

const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const extracted = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));

    return sendError(res, extracted[0].message, 400, { errors: extracted });
  };
};

module.exports = { validate };
