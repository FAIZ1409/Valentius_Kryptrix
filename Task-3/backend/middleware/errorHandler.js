const AppError = require('../utils/AppError');

function notFound(req, res, next) { next(new AppError('Route not found.', 404)); }

function errorHandler(err, req, res, next) {
  let status = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  
  if (err.name === 'SequelizeUniqueConstraintError') { status = 409; message = 'Email already exists.'; }
  if (status >= 500) console.error(err);

  res.status(status).json({ error: { status, message, ...(err.details && { details: err.details }) } });
}
module.exports = { notFound, errorHandler };