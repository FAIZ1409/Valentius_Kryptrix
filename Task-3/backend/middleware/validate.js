const { validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

function validate(chains) {
  return async function (req, res, next) {
    await Promise.all(chains.map(chain => chain.run(req)));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const details = errors.array().map(e => ({ field: e.path, message: e.msg }));
      return next(new AppError('Validation failed.', 400, details));
    }
    next();
  };
}
module.exports = { validate };