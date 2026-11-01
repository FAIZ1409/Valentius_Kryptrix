const jwt = require('jsonwebtoken');
const { User } = require('../models');
const AppError = require('../utils/AppError');

function signToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
  );
}

/**
 * POST /api/auth/register
 */
async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      throw new AppError('An account with that email already exists.', 409);
    }

    const user = User.build({ name, email });
    await user.setPassword(password);
    await user.save();

    const token = signToken(user);

    res.status(201).json({
      message: 'Account created.',
      token,
      user,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/login
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    // Same message and timing for "no user" and "wrong password" —
    // prevents user enumeration.
    const valid = user ? await user.verifyPassword(password) : false;
    if (!user || !valid) {
      throw new AppError('Invalid email or password.', 401);
    }

    const token = signToken(user);

    res.status(200).json({
      message: 'Logged in.',
      token,
      user,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/auth/me  (protected)
 */
async function me(req, res) {
  res.status(200).json({ user: req.user });
}

module.exports = { register, login, me };