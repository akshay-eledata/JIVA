const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// One booked blood draw. `visit` mirrors LabReport.visit so an appointment can
// be lined up with the report it eventually produces: visit 1 is the baseline
// draw taken during onboarding, visit 2 and up are retests.
//
// Demo build: the lab network in the frontend is placeholder data, so labName
// and labAddress are stored as plain strings rather than a foreign key to a
// labs table. Swap in a real reference once a partner integration lands.
const Appointment = sequelize.define('Appointment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  scheduledDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  timeSlot: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Display string for the slot, e.g. "7:30 AM"'
  },
  labName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  labAddress: {
    type: DataTypes.STRING,
    allowNull: true
  },
  visit: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    comment: 'Draw sequence: 1 = baseline, 2+ = retest. Mirrors LabReport.visit'
  },
  status: {
    type: DataTypes.ENUM('scheduled', 'completed', 'cancelled'),
    defaultValue: 'scheduled'
  }
}, {
  timestamps: true
});

// Association to User is defined centrally in models/index.js.
module.exports = Appointment;
