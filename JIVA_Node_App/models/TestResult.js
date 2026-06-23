const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');
const Biomarker = require('./Biomarker');

// The TestResult represents actual patient data from a lab
const TestResult = sequelize.define('TestResult', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  value: {
    type: DataTypes.FLOAT,
    allowNull: false,
    comment: 'The actual number from their blood test'
  },
  dateTested: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  isNormal: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    comment: 'Backend calculates this by comparing value to ReferenceRange'
  }
}, {
  timestamps: true
});

// Relationships
User.hasMany(TestResult, { foreignKey: 'userId', onDelete: 'CASCADE' });
TestResult.belongsTo(User, { foreignKey: 'userId' });

Biomarker.hasMany(TestResult, { foreignKey: 'biomarkerId', onDelete: 'CASCADE' });
TestResult.belongsTo(Biomarker, { foreignKey: 'biomarkerId' });

module.exports = TestResult;
