const path = require('path');
const { Sequelize } = require('sequelize');

const storage = process.env.DB_STORAGE || path.join(__dirname, '..', 'database.sqlite');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage,
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    underscored: true, // user_id instead of userId in the DB columns
  },
});

module.exports = sequelize;