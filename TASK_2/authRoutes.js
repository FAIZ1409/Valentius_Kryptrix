const express = require('express');
const { body } = require('express-validator');
const { register, login, me } = require('../controllers/authController');
const { validate } = require('../middleware/validate');
const { verifyJWT } = require('../middleware/auth');

const router = express.Router();

const registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required.').isLength({ max: 80 }),
  body('email').trim().isEmail().withMessage('A valid email is required.').normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters.')
    .matches(/[A-Za-z]/)
    .withMessage('Password must contain a letter.')
    .matches(/\d/)
    .withMessage('Password must contain a number.'),
];

const loginRules = [
  body('email').trim().isEmail().withMessage('A valid email is required.').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required.'),
];

router.post('/register', validate(registerRules), register);
router.post('/login', validate(loginRules), login);
router.get('/me', verifyJWT, me);

module.exports = router;