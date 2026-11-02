const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Task = sequelize.define('Task', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  title: { type: DataTypes.STRING(120), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  status: { type: DataTypes.ENUM('todo', 'in_progress', 'done'), defaultValue: 'todo' },
  dueDate: { type: DataTypes.DATEONLY, allowNull: true, field: 'due_date' },
  userId: { type: DataTypes.UUID, allowNull: false, field: 'user_id' },
}, { tableName: 'tasks', timestamps: true });

Task.STATUSES = ['todo', 'in_progress', 'done'];
module.exports = Task;