const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// Covers both foods_to_eat and foods_to_avoid (distinguished by `kind`).
const FoodRecommendation = sequelize.define('FoodRecommendation', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  kind: {
    type: DataTypes.ENUM('eat', 'avoid'),
    allowNull: false
  },
  rank: { type: DataTypes.INTEGER, allowNull: true },
  food: { type: DataTypes.TEXT, allowNull: false },
  quantityFrequency: { type: DataTypes.TEXT, allowNull: true, comment: 'eat: quantity_frequency' },
  avoidanceLevel: { type: DataTypes.STRING, allowNull: true, comment: 'avoid: REDUCE / ELIMINATE' },
  reductionTarget: { type: DataTypes.TEXT, allowNull: true, comment: 'avoid: reduction_target' },
  targetDiagnosis: { type: DataTypes.TEXT, allowNull: true },
  rationale: { type: DataTypes.TEXT, allowNull: true, comment: 'why_it_helps / why_to_avoid' }
}, {
  timestamps: true
});

module.exports = FoodRecommendation;
