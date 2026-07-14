const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// Intake questionnaire, stored as JSONB to mirror the flexible `questionnaire`
// block of an engine input.
const Questionnaire = sequelize.define('Questionnaire', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  data: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {}
  }
}, {
  timestamps: true
});

module.exports = Questionnaire;
