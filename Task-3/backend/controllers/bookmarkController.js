const { Bookmark, Category } = require('../models');
const AppError = require('../utils/AppError');

exports.list = async (req, res, next) => {
  try {
    const bookmarks = await Bookmark.findAll({ 
      where: { userId: req.user.id }, 
      include: [{ model: Category, attributes: ['name'] }],
      order: [['createdAt', 'DESC']] 
    });
    res.status(200).json({ count: bookmarks.length, bookmarks });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const bookmark = await Bookmark.create({ ...req.body, userId: req.user.id });
    res.status(201).json({ message: 'Bookmark created.', bookmark });
  } catch (err) { next(err); }
};

exports.delete = async (req, res, next) => {
  try {
    const bookmark = await Bookmark.findByPk(req.params.id);
    if (!bookmark) throw new AppError('Not found.', 404);
    if (bookmark.userId !== req.user.id) throw new AppError('Forbidden.', 403);
    await bookmark.destroy();
    res.status(204).send();
  } catch (err) { next(err); }
};
