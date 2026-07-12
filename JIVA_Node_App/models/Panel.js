const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// A Panel is a purchasable lab package (formerly "Package"). One base panel is
// mandatory; the rest are add-ons.
const Panel = sequelize.define('Panel', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
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
    allowNull: false,
    defaultValue: 0
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true
});

module.exports = Panel;
