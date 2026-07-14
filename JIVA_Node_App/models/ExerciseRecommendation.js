const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// Exercise recommendations (yoga is represented here, not as a separate section).
const ExerciseRecommendation = sequelize.define('ExerciseRecommendation', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  rank: { type: DataTypes.INTEGER, allowNull: true },
  exerciseType: { type: DataTypes.TEXT, allowNull: false },
  frequency: { type: DataTypes.STRING, allowNull: true },
  duration: { type: DataTypes.STRING, allowNull: true },
  intensity: { type: DataTypes.STRING, allowNull: true },
  targetDiagnosis: { type: DataTypes.TEXT, allowNull: true },
  whyItHelps: { type: DataTypes.TEXT, allowNull: true },
  safetyNotes: { type: DataTypes.TEXT, allowNull: true }
}, {
  timestamps: true
});

module.exports = ExerciseRecommendation;
