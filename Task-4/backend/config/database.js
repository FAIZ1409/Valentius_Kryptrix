// config/database.js
const { Sequelize } = require('sequelize');
require('dotenv').config(); // Ensure environment variables are loaded

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Necessary for Render's external connection
    }
  },
  define: {
    underscored: true,
  },
});

module.exports = sequelize;