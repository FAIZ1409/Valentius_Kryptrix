const path = require('path');
const { Sequelize } = require('sequelize');
const storage = process.env.DB_STORAGE || path.join(__dirname, '..', 'database.sqlite');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage,
  logging: false,
  define: { underscored: true },
});

module.exports = sequelize;