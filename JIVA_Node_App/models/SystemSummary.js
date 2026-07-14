const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// Per-system narrative from the engine output. `systemName` stores the (raw)
// engine name; `FunctionalSystemId` links to our canonical 10-system taxonomy.
const SystemSummary = sequelize.define('SystemSummary', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  systemName: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Raw engine system name, e.g., Cardiovascular'
  },
  biomarkersIncluded: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
    defaultValue: []
  },
  summary: { type: DataTypes.TEXT, allowNull: true }
}, {
  timestamps: true
});

module.exports = SystemSummary;
