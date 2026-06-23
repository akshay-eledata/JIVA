const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Biomarker = require('./Biomarker');

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

// A Biomarker can have many Reference Ranges (e.g. one for male, one for female)
Biomarker.hasMany(ReferenceRange, { foreignKey: 'biomarkerId', onDelete: 'CASCADE' });
ReferenceRange.belongsTo(Biomarker, { foreignKey: 'biomarkerId' });

module.exports = ReferenceRange;
