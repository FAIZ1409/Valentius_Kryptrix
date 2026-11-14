const { Category } = require('../models');

exports.list = async (req, res, next) => {
  try {
    const categories = await Category.findAll({ where: { userId: req.user.id } });
    res.status(200).json({ categories });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const category = await Category.create({ name: req.body.name, userId: req.user.id });
    res.status(201).json({ category });
  } catch (err) { next(err); }
};
