const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Category = require('./Category');

// The Biomarker model is our "Dictionary" of all possible blood tests
const Biomarker = sequelize.define('Biomarker', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'e.g., Anti Nuclear Antibodies (ANA)'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true
});

// Many-to-Many Relationship:
// A Biomarker can belong to multiple Categories, and a Category can have multiple Biomarkers.
// Sequelize will automatically manage a junction table named 'BiomarkerCategories' for us.
Biomarker.belongsToMany(Category, { through: 'BiomarkerCategories', foreignKey: 'biomarkerId', onDelete: 'CASCADE' });
Category.belongsToMany(Biomarker, { through: 'BiomarkerCategories', foreignKey: 'categoryId', onDelete: 'CASCADE' });

module.exports = Biomarker;
