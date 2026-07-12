const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// Demographic snapshot for a user, mirroring the `patient` block of an engine input.
const PatientProfile = sequelize.define('PatientProfile', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  externalPatientId: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'e.g., JIVA-2026-00124'
  },
  name: {
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
  dateOfCollection: {
    type: DataTypes.DATEONLY,
    allowNull: true
  }
}, {
  timestamps: true
});

module.exports = PatientProfile;
