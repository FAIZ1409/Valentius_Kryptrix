const jwt = require('jsonwebtoken');
const { User } = require('../models');
const AppError = require('../utils/AppError');

const signToken = (user) => jwt.sign({ sub: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (await User.findOne({ where: { email } })) throw new AppError('Email exists.', 409);
    const user = User.build({ name, email });
    await user.setPassword(password);
    await user.save();
    res.status(201).json({ message: 'Account created.', token: signToken(user), user });
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.verifyPassword(password))) throw new AppError('Invalid credentials.', 401);
    res.status(200).json({ message: 'Logged in.', token: signToken(user), user });
  } catch (err) { next(err); }
};