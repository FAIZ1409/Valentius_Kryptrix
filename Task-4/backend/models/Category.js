const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Category = sequelize.define('Category', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING(50), allowNull: false },
  userId: { type: DataTypes.UUID, allowNull: false, field: 'user_id' },
}, { tableName: 'categories', timestamps: true });

module.exports = Category;
