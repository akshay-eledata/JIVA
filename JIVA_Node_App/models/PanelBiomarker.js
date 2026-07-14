const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// Join table: which biomarkers a Panel includes (from packages.json).
const PanelBiomarker = sequelize.define('PanelBiomarker', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  }
}, {
  timestamps: false
});

module.exports = PanelBiomarker;
