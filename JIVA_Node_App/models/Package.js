const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Package = sequelize.define('Package', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('base', 'addon'),
    allowNull: false,
    defaultValue: 'addon'
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  testCount: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  },
  tests: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
    defaultValue: []
  }
}, {
  timestamps: true
});

module.exports = Package;
