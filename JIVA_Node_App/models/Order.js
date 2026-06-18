const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  packageIds: {
    type: DataTypes.ARRAY(DataTypes.UUID),
    allowNull: false,
    comment: 'Array of Package IDs the user selected'
  },
  totalAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
    comment: 'Final calculated total in USD'
  },
  status: {
    type: DataTypes.ENUM('pending', 'paid', 'completed', 'cancelled'),
    defaultValue: 'pending'
  }
}, {
  timestamps: true
});

// One User can have many Orders
Order.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasMany(Order, { foreignKey: 'userId' });

module.exports = Order;
