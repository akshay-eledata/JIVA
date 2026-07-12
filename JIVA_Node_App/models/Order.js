const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  packageIds: {
    type: DataTypes.ARRAY(DataTypes.UUID),
    allowNull: false,
    comment: 'Array of Panel IDs the user selected'
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

// Association to User is defined centrally in models/index.js.
module.exports = Order;
