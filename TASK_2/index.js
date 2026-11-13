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
  await sequelize.sync({ alter: true }); // Note: use alter:true here to update the DB schema
  console.log('Database connected and synchronised.');
}
module.exports = { sequelize, User, Category, Bookmark, initDatabase };
