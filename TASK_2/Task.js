const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TASK_STATUSES = ['todo', 'in_progress', 'done'];

const Task = sequelize.define(
  'Task',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(120),
      allowNull: false,
      validate: { notEmpty: true },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    status: {
      type: DataTypes.ENUM(...TASK_STATUSES),
      allowNull: false,
      defaultValue: 'todo',
    },
    dueDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: null,
      field: 'due_date',
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'user_id',
    },
  },
  {
    tableName: 'tasks',
    timestamps: true,
    indexes: [{ fields: ['user_id'] }],
  }
);

Task.STATUSES = TASK_STATUSES;

module.exports = Task;