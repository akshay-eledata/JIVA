/**
 * /api/me/appointments/* — booking and tracking blood draws (F1, retest loop).
 *
 * All handlers operate on req.user (set by the `protect` middleware).
 */
const { Op } = require('sequelize');
const { Appointment, LabReport } = require('../models');
const {
  RETEST_INTERVAL_DAYS, RETEST_REMINDER_WINDOW_DAYS, addDays, daysUntil,
} = require('../config/retest');

const today = () => new Date().toISOString().slice(0, 10);

/**
 * The patient's next draw, in whatever state it happens to be.
 *
 * Four states drive the dashboard card:
 *   booked   an upcoming appointment exists, count down to it
 *   due      history exists and the due date has passed, prompt to rebook
 *   waiting  history exists and the due date is still ahead
 *   none     nothing has ever been drawn, prompt to book a baseline
 */
async function computeRetestStatus(userId) {
  const [upcoming, lastCompleted, completedCount, latestReport] = await Promise.all([
    Appointment.findOne({
      where: { userId, status: 'scheduled', scheduledDate: { [Op.gte]: today() } },
      order: [['scheduledDate', 'ASC']],
    }),
    Appointment.findOne({
      where: { userId, status: 'completed' },
      order: [['scheduledDate', 'DESC']],
    }),
    Appointment.count({ where: { userId, status: { [Op.ne]: 'cancelled' } } }),
    LabReport.findOne({ where: { userId }, order: [['visit', 'DESC']] }),
  ]);

  // Anchor the cadence on the last completed draw. Fall back to the newest lab
  // report, which covers patients whose history predates appointment tracking.
  const anchorDate = (lastCompleted && lastCompleted.scheduledDate)
    || (latestReport && latestReport.dateProcessed)
    || null;

  const dueDate = anchorDate ? addDays(anchorDate, RETEST_INTERVAL_DAYS) : null;
  const daysUntilDue = dueDate ? daysUntil(dueDate) : null;

  let state;
  if (upcoming) state = 'booked';
  else if (!anchorDate) state = 'none';
  else if (daysUntilDue <= 0) state = 'due';
  else state = 'waiting';

  return {
    state,
    intervalDays: RETEST_INTERVAL_DAYS,
    // Next visit number the patient would book, so the UI can say "draw 3".
    nextVisit: completedCount + (upcoming ? 0 : 1) || 1,
    upcoming: upcoming ? serialize(upcoming) : null,
    daysUntilAppointment: upcoming ? daysUntil(upcoming.scheduledDate) : null,
    lastDrawDate: anchorDate,
    dueDate,
    daysUntilDue,
    // True once we are close enough to the due date to start nudging.
    inReminderWindow: daysUntilDue != null && daysUntilDue <= RETEST_REMINDER_WINDOW_DAYS,
    // Prefill for a one-tap rebooking at the same site.
    lastLab: lastCompleted
      ? { name: lastCompleted.labName, address: lastCompleted.labAddress }
      : null,
  };
}

function serialize(a) {
  return {
    id: a.id,
    scheduledDate: a.scheduledDate,
    timeSlot: a.timeSlot,
    labName: a.labName,
    labAddress: a.labAddress,
    visit: a.visit,
    status: a.status,
  };
}

// @desc    Book a draw. Assigns the next visit number automatically.
// @route   POST /api/me/appointments
// @access  Private
const createAppointment = async (req, res) => {
  const { scheduledDate, timeSlot, labName, labAddress } = req.body;

  if (!scheduledDate || !timeSlot || !labName) {
    return res.status(400).json({ message: 'A date, a time slot and a lab are all required.' });
  }

  try {
    // Cancelled bookings must not consume a visit number, otherwise a patient
    // who reschedules twice ends up with a baseline labelled "draw 3".
    const priorCount = await Appointment.count({
      where: { userId: req.user.id, status: { [Op.ne]: 'cancelled' } },
    });

    const appointment = await Appointment.create({
      userId: req.user.id,
      scheduledDate,
      timeSlot,
      labName,
      labAddress: labAddress || null,
      visit: priorCount + 1,
    });

    res.status(201).json(serialize(appointment));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Every draw for this patient, newest first.
// @route   GET /api/me/appointments
// @access  Private
const listAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      where: { userId: req.user.id },
      order: [['scheduledDate', 'DESC']],
    });
    res.json(appointments.map(serialize));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Next-draw card data for the dashboard.
// @route   GET /api/me/appointments/retest-status
// @access  Private
const getRetestStatus = async (req, res) => {
  try {
    res.json(await computeRetestStatus(req.user.id));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel a booked draw.
// @route   PATCH /api/me/appointments/:id/cancel
// @access  Private
const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }
    appointment.status = 'cancelled';
    await appointment.save();
    res.json(serialize(appointment));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createAppointment, listAppointments, getRetestStatus, cancelAppointment };
