const sequelize = require('../config/database');
const User = require('./User');
const Category = require('./Category');
const Bookmark = require('./Bookmark');

// Associations
User.hasMany(Category, { foreignKey: 'userId', onDelete: 'CASCADE' });
Category.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Bookmark, { foreignKey: 'userId', onDelete: 'CASCADE' });
Bookmark.belongsTo(User, { foreignKey: 'userId' });

Category.hasMany(Bookmark, { foreignKey: 'categoryId', onDelete: 'SET NULL' });
Bookmark.belongsTo(Category, { foreignKey: 'categoryId' });

async function initDatabase() {
  await sequelize.authenticate();
  // `alter: true` is okay here for the first deploy to create the new tables
  await sequelize.sync({ alter: true }); 
  console.log('Database connected and synchronised.');
}

module.exports = { sequelize, User, Category, Bookmark, initDatabase };
