const { Bookmark, Category } = require('../models');
const AppError = require('../utils/AppError');

// 1. GET all bookmarks
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

// 2. GET one bookmark
exports.getOne = async (req, res, next) => {
  try {
    const bookmark = await Bookmark.findByPk(req.params.id);
    if (!bookmark) throw new AppError('Bookmark not found.', 404);
    if (bookmark.userId !== req.user.id) throw new AppError('Forbidden.', 403);
    res.status(200).json({ bookmark });
  } catch (err) { next(err); }
};

// 3. POST (create) a bookmark
exports.create = async (req, res, next) => {
  try {
    const bookmark = await Bookmark.create({ ...req.body, userId: req.user.id });
    res.status(201).json({ message: 'Bookmark created.', bookmark });
  } catch (err) { next(err); }
};

// 4. PATCH (update) a bookmark
exports.update = async (req, res, next) => {
  try {
    const bookmark = await Bookmark.findByPk(req.params.id);
    if (!bookmark) throw new AppError('Bookmark not found.', 404);
    if (bookmark.userId !== req.user.id) throw new AppError('Forbidden.', 403);
    
    await bookmark.update(req.body);
    res.status(200).json({ message: 'Bookmark updated.', bookmark });
  } catch (err) { next(err); }
};

// 5. DELETE a bookmark
exports.delete = async (req, res, next) => {
  try {
    const bookmark = await Bookmark.findByPk(req.params.id);
    if (!bookmark) throw new AppError('Bookmark not found.', 404);
    if (bookmark.userId !== req.user.id) throw new AppError('Forbidden.', 403);
    
    await bookmark.destroy();
    res.status(204).send();
  } catch (err) { next(err); }
};
