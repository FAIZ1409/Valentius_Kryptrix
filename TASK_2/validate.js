const { validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

/**
 * Wraps an array of express-validator chains. If any fail,
 * responds 400 with a normalised error list.
 */
function validate(chains) {
  return async function (req, res, next) {
    try {
      await Promise.all(chains.map((chain) => chain.run(req)));

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const details = errors.array().map((e) => ({
          field: e.path,
          message: e.msg,
          value: e.value,
        }));
        throw new AppError('Validation failed.', 400, details);
      }
      next();
    } catch (err) {
      next(err);
    }
  };
}

module.exports = { validate };