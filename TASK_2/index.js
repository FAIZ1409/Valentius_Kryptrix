const sequelize = require('../config/database');
const User = require('./User');
const Task = require('./Task');

// One user has many tasks. Deleting a user deletes their tasks.
User.hasMany(Task, { foreignKey: 'userId', onDelete: 'CASCADE' });
Task.belongsTo(User, { foreignKey: 'userId' });

async function initDatabase() {
  await sequelize.authenticate();
  console.log('Database connected.');
  // `alter: true` is fine for development. In production use migrations.
  await sequelize.sync({ alter: true });
  console.log('Models synchronised.');
}

module.exports = { sequelize, User, Task, initDatabase };