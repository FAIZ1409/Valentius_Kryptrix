const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const auth = require('../controllers/authController');

const router = express.Router();

router.post('/register', validate([
  body('name').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 8 })
]), auth.register);

router.post('/login', validate([
  body('email').isEmail(),
  body('password').notEmpty()
]), auth.login);

module.exports = router;