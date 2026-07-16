const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// The Biomarker model is our "Dictionary" of all possible blood tests.
// Each biomarker has a single primary FunctionalSystem (see models/index.js).
const Biomarker = sequelize.define('Biomarker', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Canonical display name, e.g., Total testosterone'
  },
  canonicalName: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Normalized lookup key for matching messy lab test_names'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  defaultUnit: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true
});

// Associations (FunctionalSystem, Panels, ReferenceRanges) are defined centrally
// in models/index.js.
module.exports = Biomarker;
