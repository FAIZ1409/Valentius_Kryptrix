const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');

const SALT_ROUNDS = 12;

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(80),
      allowNull: false,
      validate: { notEmpty: true },
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'password_hash',
    },
  },
  {
    tableName: 'users',
    timestamps: true,
  }
);

/**
 * Hash and set the password. The plain-text password never
 * touches the database and is never stored on the instance.
 */
User.prototype.setPassword = async function (plainPassword) {
  this.passwordHash = await bcrypt.hash(plainPassword, SALT_ROUNDS);
};

/**
 * Constant-time comparison via bcrypt.compare.
 */
User.prototype.verifyPassword = function (plainPassword) {
  return bcrypt.compare(plainPassword, this.passwordHash);
};

/**
 * Never serialise the hash. toJSON is what Express uses
 * when you call res.json(user).
 */
User.prototype.toJSON = function () {
  const { passwordHash, ...safe } = this.get({ plain: true });
  return safe;
};

module.exports = User;