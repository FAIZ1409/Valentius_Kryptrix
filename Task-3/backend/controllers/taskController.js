const { Task } = require('../models');
const AppError = require('../utils/AppError');

exports.list = async (req, res, next) => {
  try {
    const tasks = await Task.findAll({ where: { userId: req.user.id }, order: [['createdAt', 'DESC']] });
    res.status(200).json({ count: tasks.length, tasks });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const task = await Task.create({ ...req.body, userId: req.user.id });
    res.status(201).json({ message: 'Task created.', task });
  } catch (err) { next(err); }
};

exports.getOne = async (req, res, next) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) throw new AppError('Not found.', 404);
    if (task.userId !== req.user.id) throw new AppError('Forbidden.', 403);
    res.status(200).json({ task });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) throw new AppError('Not found.', 404);
    if (task.userId !== req.user.id) throw new AppError('Forbidden.', 403);
    await task.update(req.body);
    res.status(200).json({ message: 'Updated.', task });
  } catch (err) { next(err); }
};

exports.delete = async (req, res, next) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) throw new AppError('Not found.', 404);
    if (task.userId !== req.user.id) throw new AppError('Forbidden.', 403);
    await task.destroy();
    res.status(204).send();
  } catch (err) { next(err); }
};