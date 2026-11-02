const jwt = require('jsonwebtoken');
const { User } = require('../models');
const AppError = require('../utils/AppError');

async function verifyJWT(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) throw new AppError('Authentication required.', 401);
    const token = header.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(payload.sub);
    if (!user) throw new AppError('User not found.', 401);
    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') return next(new AppError('Invalid token.', 401));
    if (err.name === 'TokenExpiredError') return next(new AppError('Token expired.', 401));
    next(err);
  }
}
module.exports = { verifyJWT };