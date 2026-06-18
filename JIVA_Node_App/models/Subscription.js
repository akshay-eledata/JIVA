const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');
const Package = require('./Package');

const Subscription = sequelize.define('Subscription', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  startDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('active', 'cancelled', 'expired'),
    defaultValue: 'active'
  }
}, {
  timestamps: true
});

Subscription.belongsTo(User, { foreignKey: 'userId' });
Subscription.belongsTo(Package, { foreignKey: 'packageId' });
User.hasMany(Subscription, { foreignKey: 'userId' });
Package.hasMany(Subscription, { foreignKey: 'packageId' });

module.exports = Subscription;
