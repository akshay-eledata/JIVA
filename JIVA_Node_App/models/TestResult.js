const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// The TestResult represents an actual lab value for a patient. Values can be
// qualitative ("Normal", "Negative", "B") so `value` is a STRING; `numericValue`
// holds the parsed number when available.
const TestResult = sequelize.define('TestResult', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  testName: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Raw lab test_name as reported'
  },
  value: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Raw value (may be qualitative)'
  },
  numericValue: {
    type: DataTypes.FLOAT,
    allowNull: true,
    comment: 'Parsed numeric value when the result is quantitative'
  },
  unit: {
    type: DataTypes.STRING,
    allowNull: true
  },
  refLow: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  refHigh: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('in_range', 'borderline', 'out_of_range', 'critical', 'abnormal', 'unknown'),
    allowNull: false,
    defaultValue: 'unknown'
  },
  isNormal: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    comment: 'Convenience flag derived from status'
  },
  panel: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Raw panel name the lab came from'
  },
  systemNameRaw: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Raw engine system name this lab was grouped under'
  },
  dateTested: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: true
});

// Relationships (User, LabReport, Biomarker, FunctionalSystem) are defined
// centrally in models/index.js.
module.exports = TestResult;
