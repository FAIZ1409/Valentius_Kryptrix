const express = require('express');
const { body, param } = require('express-validator');
const { validate } = require('../middleware/validate');
const { verifyJWT } = require('../middleware/auth');
const ctrl = require('../controllers/bookmarkController');

const router = express.Router();
router.use(verifyJWT);

const idRule = param('id').isUUID().withMessage('Invalid ID format');

router.route('/')
  .get(ctrl.list)
  .post(validate([
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('url').trim().notEmpty().withMessage('URL is required').isURL().withMessage('Must be a valid URL'),
    body('description').optional({ nullable: true }).isString(),
    body('categoryId').optional({ nullable: true }).isUUID().withMessage('Invalid Category ID')
  ]), ctrl.create);

router.route('/:id')
  .get(validate([idRule]), ctrl.getOne)
  .patch(validate([
    idRule,
    body('url').optional().isURL().withMessage('Must be a valid URL'),
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    body('categoryId').optional({ nullable: true }).isUUID()
  ]), ctrl.update)
  .delete(validate([idRule]), ctrl.delete);

module.exports = router;
