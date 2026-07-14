const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// One LabReport per processed blood draw. Holds the `lab_analysis` rollup plus
// the patient-facing summary. Diagnoses / recommendations / system summaries
// hang off of it.
const LabReport = sequelize.define('LabReport', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  externalPatientId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  patientName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  sex: {
    type: DataTypes.STRING,
    allowNull: true
  },
  dateProcessed: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  totalLabsReviewed: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  inRangeCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  borderlineCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  outOfRangeCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  criticalCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  criticalAlert: { type: DataTypes.TEXT, allowNull: true },
  panelsPresent: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
    defaultValue: []
  },
  patientSummary: { type: DataTypes.TEXT, allowNull: true },
  overallSummary: { type: DataTypes.TEXT, allowNull: true }
}, {
  timestamps: true
});

module.exports = LabReport;
