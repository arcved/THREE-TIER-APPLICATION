const ApiError = require('../utils/ApiError');

function errorHandler(err, req, res, next) {
  let { statusCode, message, details } = err;

  // Mongoose validation errors and cast errors aren't ApiErrors by default —
  // normalize them so the client always gets the same error shape.
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    details = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid value for ${err.path}`;
  } else if (err.code === 11000) {
    statusCode = 409;
    message = 'Duplicate value';
    details = Object.keys(err.keyValue).map((field) => ({
      field,
      message: `${field} already in use`,
    }));
  }

  if (!statusCode) statusCode = 500;
  if (!message) message = 'Internal server error';

  if (statusCode === 500) {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(details ? { details } : {}),
    },
  });
}

function notFoundHandler(req, res, next) {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
}

module.exports = { errorHandler, notFoundHandler };
