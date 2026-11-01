const AppError = require('../utils/AppError');

function notFound(req, res, next) {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let details = err.details;

  // Sequelize-specific translations
  if (err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 409;
    message = 'A record with that value already exists.';
    details = err.errors.map((e) => ({ field: e.path, message: e.message }));
  }

  if (err.name === 'SequelizeValidationError') {
    statusCode = 400;
    message = 'Database validation failed.';
    details = err.errors.map((e) => ({ field: e.path, message: e.message }));
  }

  if (statusCode >= 500) {
    console.error('UNHANDLED ERROR:', err);
    message = 'Internal server error'; // never leak internals
  }

  res.status(statusCode).json({
    error: {
      status: statusCode,
      message,
      ...(details ? { details } : {}),
    },
  });
}

module.exports = { notFound, errorHandler };