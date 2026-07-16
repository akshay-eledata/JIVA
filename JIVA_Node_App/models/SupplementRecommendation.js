const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const SupplementRecommendation = sequelize.define('SupplementRecommendation', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  rank: { type: DataTypes.INTEGER, allowNull: true },
  supplementName: { type: DataTypes.TEXT, allowNull: false },
  dosageRange: { type: DataTypes.STRING, allowNull: true },
  timing: { type: DataTypes.STRING, allowNull: true },
  targetDiagnosis: { type: DataTypes.TEXT, allowNull: true },
  whyItHelps: { type: DataTypes.TEXT, allowNull: true },
  safetyNote: { type: DataTypes.TEXT, allowNull: true },
  localAvailabilityNote: { type: DataTypes.TEXT, allowNull: true },
  startTier: { type: DataTypes.STRING, allowNull: true, comment: 'e.g., Start Here / Discuss With Your Doctor First' }
}, {
  timestamps: true
});

module.exports = SupplementRecommendation;
