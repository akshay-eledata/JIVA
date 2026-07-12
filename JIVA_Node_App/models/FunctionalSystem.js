const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// The canonical grouping used across the Vitality Map (10 systems total).
const FunctionalSystem = sequelize.define('FunctionalSystem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: 'e.g., Blood, Heart, Hormonal/Reproductive'
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: 'URL-safe identifier, e.g., hormonal-reproductive'
  },
  displayName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  colorHint: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Optional hex/color token for the UI'
  },
  sortOrder: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  timestamps: true
});

module.exports = FunctionalSystem;
