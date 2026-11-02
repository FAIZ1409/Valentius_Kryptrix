const sequelize = require('../config/database');
const User = require('./User');
const Task = require('./Task');

User.hasMany(Task, { foreignKey: 'userId', onDelete: 'CASCADE' });
Task.belongsTo(User, { foreignKey: 'userId' });

async function initDatabase() {
  await sequelize.authenticate();
  await sequelize.sync(); // Removed alter:true so it doesn't wipe data
  console.log('Database connected and synchronised.');
}
module.exports = { sequelize, User, Task, initDatabase };