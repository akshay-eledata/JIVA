const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// The Biomarker model is our "Dictionary" of all possible blood tests
const Biomarker = sequelize.define('Biomarker', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'e.g., Anti Nuclear Antibodies (ANA)'
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'e.g., AutoImmunity or Cardio-Metabolic'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true
});

module.exports = Biomarker;
