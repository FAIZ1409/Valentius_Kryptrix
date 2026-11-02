const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING(80), allowNull: false },
  email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
  passwordHash: { type: DataTypes.STRING, allowNull: false, field: 'password_hash' },
});

User.prototype.setPassword = async function (plain) {
  this.passwordHash = await bcrypt.hash(plain, 12);
};
User.prototype.verifyPassword = function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};
User.prototype.toJSON = function () {
  const { passwordHash, ...safe } = this.get({ plain: true });
  return safe;
};
module.exports = User;