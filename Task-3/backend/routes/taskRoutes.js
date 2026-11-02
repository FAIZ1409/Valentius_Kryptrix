const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { verifyJWT } = require('../middleware/auth');
const ctrl = require('../controllers/taskController');
const { Task } = require('../models');

const router = express.Router();
router.use(verifyJWT);

router.route('/')
  .get(ctrl.list)
  .post(validate([
    body('title').trim().notEmpty().withMessage('Title required'),
    body('status').optional().isIn(Task.STATUSES)
  ]), ctrl.create);

router.route('/:id')
  .get(ctrl.getOne)
  .patch(ctrl.update)
  .delete(ctrl.delete);

module.exports = router;