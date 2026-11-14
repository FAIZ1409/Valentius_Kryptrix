const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { verifyJWT } = require('../middleware/auth');
const ctrl = require('../controllers/categoryController');

const router = express.Router();
router.use(verifyJWT);

router.route('/')
  .get(ctrl.list)
  .post(validate([
    body('name').trim().notEmpty().withMessage('Category name required')
  ]), ctrl.create);

module.exports = router;
