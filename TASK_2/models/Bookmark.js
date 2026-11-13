const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Bookmark = sequelize.define('Bookmark', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  title: { type: DataTypes.STRING(120), allowNull: false },
  url: { type: DataTypes.STRING(500), allowNull: false, validate: { isUrl: true } },
  description: { type: DataTypes.TEXT, allowNull: true },
  userId: { type: DataTypes.UUID, allowNull: false, field: 'user_id' },
  categoryId: { type: DataTypes.UUID, allowNull: true, field: 'category_id' },
}, { tableName: 'bookmarks', timestamps: true });

module.exports = Bookmark;
