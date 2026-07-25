const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

// Runs after express-validator check(...) chains. Collects any errors into
// the standard { field, message } shape and forwards a single ApiError.
function validate(req, res, next) {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  const details = errors.array().map((e) => ({
    field: e.path,
    message: e.msg,
  }));

  next(new ApiError(400, 'Validation failed', details));
}

module.exports = validate;
