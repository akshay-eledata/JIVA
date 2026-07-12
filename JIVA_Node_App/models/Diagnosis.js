const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Diagnosis = sequelize.define('Diagnosis', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  rank: { type: DataTypes.INTEGER, allowNull: true },
  diagnosis: { type: DataTypes.TEXT, allowNull: false },
  confidence: { type: DataTypes.STRING, allowNull: true, comment: 'e.g., HIGH / MODERATE / LOW' },
  supportingLabs: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
    defaultValue: []
  },
  clinicalRationale: { type: DataTypes.TEXT, allowNull: true }
}, {
  timestamps: true
});

module.exports = Diagnosis;
