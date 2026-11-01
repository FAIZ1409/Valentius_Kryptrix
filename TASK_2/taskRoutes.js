const express = require('express');
const { body, param, query } = require('express-validator');
const { Task } = require('../models');
const ctrl = require('../controllers/taskController');
const { validate } = require('../middleware/validate');
const { verifyJWT } = require('../middleware/auth');

const router = express.Router();

// Every task route requires a valid JWT.
router.use(verifyJWT);

const idRule = param('id').isUUID().withMessage('Task id must be a UUID.');

const statusRule = body('status')
  .optional()
  .isIn(Task.STATUSES)
  .withMessage(`Status must be one of: ${Task.STATUSES.join(', ')}.`);

const dueDateRule = body('dueDate')
  .optional({ nullable: true })
  .isISO8601({ strict: true })
  .withMessage('dueDate must be a valid ISO date (YYYY-MM-DD).');

const createRules = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required.')
    .isLength({ max: 120 })
    .withMessage('Title must be 120 characters or fewer.'),
  body('description').optional({ nullable: true }).isString().isLength({ max: 2000 }),
  statusRule,
  dueDateRule,
];

const replaceRules = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required for a full replacement.')
    .isLength({ max: 120 }),
  body('description').optional({ nullable: true }).isString().isLength({ max: 2000 }),
  statusRule,
  dueDateRule,
];

const patchRules = [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty.').isLength({ max: 120 }),
  body('description').optional({ nullable: true }).isString().isLength({ max: 2000 }),
  statusRule,
  dueDateRule,
];

router.get(
  '/',
  validate([
    query('status').optional().isIn(Task.STATUSES).withMessage(`Status must be one of: ${Task.STATUSES.join(', ')}.`),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  ]),
  ctrl.listTasks
);

router.get('/:id', validate([idRule]), ctrl.getTask);
router.post('/', validate(createRules), ctrl.createTask);
router.put('/:id', validate([idRule, ...replaceRules]), ctrl.replaceTask);
router.patch('/:id', validate([idRule, ...patchRules]), ctrl.updateTask);
router.delete('/:id', validate([idRule]), ctrl.deleteTask);

module.exports = router;