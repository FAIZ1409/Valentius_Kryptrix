const { Task } = require('../models');
const AppError = require('../utils/AppError');

/**
 * GET /api/tasks
 * Supports ?status=todo|in_progress|done and ?limit=1..100
 */
async function listTasks(req, res, next) {
  try {
    const { status, limit } = req.query;

    const where = { userId: req.user.id };
    if (status) where.status = status;

    const take = Math.min(Number(limit) || 50, 100);

    const tasks = await Task.findAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: take,
    });

    res.status(200).json({ count: tasks.length, tasks });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/tasks/:id
 */
async function getTask(req, res, next) {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) throw new AppError('Task not found.', 404);

    if (task.userId !== req.user.id) {
      throw new AppError('You do not have permission to access this task.', 403);
    }

    res.status(200).json({ task });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/tasks
 */
async function createTask(req, res, next) {
  try {
    const { title, description, status, dueDate } = req.body;

    const task = await Task.create({
      title,
      description: description ?? null,
      status: status ?? 'todo',
      dueDate: dueDate ?? null,
      userId: req.user.id,
    });

    res.status(201).json({ message: 'Task created.', task });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/tasks/:id
 * Full replacement — title required, other fields reset to defaults.
 */
async function replaceTask(req, res, next) {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) throw new AppError('Task not found.', 404);
    if (task.userId !== req.user.id) throw new AppError('Forbidden.', 403);

    const { title, description, status, dueDate } = req.body;

    task.title = title;
    task.description = description ?? null;
    task.status = status ?? 'todo';
    task.dueDate = dueDate ?? null;
    await task.save();

    res.status(200).json({ message: 'Task replaced.', task });
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/tasks/:id
 * Partial update — only provided fields change.
 */
async function updateTask(req, res, next) {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) throw new AppError('Task not found.', 404);
    if (task.userId !== req.user.id) throw new AppError('Forbidden.', 403);

    const fields = ['title', 'description', 'status', 'dueDate'];
    for (const key of fields) {
      if (req.body[key] !== undefined) task[key] = req.body[key];
    }
    await task.save();

    res.status(200).json({ message: 'Task updated.', task });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/tasks/:id
 */
async function deleteTask(req, res, next) {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) throw new AppError('Task not found.', 404);
    if (task.userId !== req.user.id) throw new AppError('Forbidden.', 403);

    await task.destroy();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listTasks,
  getTask,
  createTask,
  replaceTask,
  updateTask,
  deleteTask,
};