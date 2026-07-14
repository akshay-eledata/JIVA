const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// The ReferenceRange defines what is "healthy" for a specific Biomarker
const ReferenceRange = sequelize.define('ReferenceRange', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  minRange: {
    type: DataTypes.FLOAT,
    allowNull: true, // Some tests only have a max limit
    comment: 'Lowest healthy number'
  },
  maxRange: {
    type: DataTypes.FLOAT,
    allowNull: true, // Some tests only have a min limit
    comment: 'Highest healthy number'
  },
  unit: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'e.g., nmol/L or mg/dL'
  },
  condition: {
    type: DataTypes.STRING,
    defaultValue: 'general',
    comment: 'e.g., male, female, or general'
  }
}, {
  timestamps: true
});

// Association to Biomarker is defined centrally in models/index.js.
module.exports = ReferenceRange;
