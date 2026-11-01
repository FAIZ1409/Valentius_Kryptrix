const jwt = require('jsonwebtoken');
const { User } = require('../models');
const AppError = require('../utils/AppError');

/**
 * Requires a valid `Authorization: Bearer <token>` header.
 * On success attaches the full User instance to req.user.
 */
async function verifyJWT(req, res, next) {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
      throw new AppError('Authentication required. Send an Authorization: Bearer <token> header.', 401);
    }

    const token = header.slice(7).trim();
    if (!token) throw new AppError('Malformed Authorization header.', 401);

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        throw new AppError('Token expired. Please log in again.', 401);
      }
      throw new AppError('Invalid token.', 401);
    }

    const user = await User.findByPk(payload.sub);
    if (!user) {
      throw new AppError('User no longer exists.', 401);
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = { verifyJWT };