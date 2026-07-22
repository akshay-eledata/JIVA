// Lab appointments: the baseline draw booked during onboarding and every
// retest after it (F1).
//
// Bookings are persisted server side. localStorage is kept as a mirror so the
// success screen still shows the booking back when the demo skip path is used
// without a session, and so the confirmation survives a refresh mid-flow.

import { apiUrl } from '../config';

const KEY = 'jiva_lab_appointment';

export interface LabAppointment {
  /** ISO yyyy-mm-dd. */
  date: string;
  /** Human readable version of the same day. */
  dateLabel: string;
  time: string;
  labName: string;
  labAddress: string;
}

/** Where the patient stands in the retest cycle. Mirrors the API shape. */
export interface RetestStatus {
  /** booked = a draw is on the calendar; due = time to rebook; waiting = not yet; none = never drawn. */
  state: 'booked' | 'due' | 'waiting' | 'none';
  intervalDays: number;
  nextVisit: number;
  upcoming: {
    id: string;
    scheduledDate: string;
    timeSlot: string;
    labName: string;
    labAddress: string | null;
    visit: number;
    status: string;
  } | null;
  daysUntilAppointment: number | null;
  lastDrawDate: string | null;
  dueDate: string | null;
  daysUntilDue: number | null;
  inReminderWindow: boolean;
  lastLab: { name: string; address: string | null } | null;
}

const authHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/* ───────────────────────────── local mirror ───────────────────────────── */

export function saveAppointment(appointment: LabAppointment): void {
  localStorage.setItem(KEY, JSON.stringify(appointment));
}

export function loadAppointment(): LabAppointment | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as LabAppointment) : null;
  } catch {
    return null;
  }
}

export function clearAppointment(): void {
  localStorage.removeItem(KEY);
}

/* ─────────────────────────────── the API ──────────────────────────────── */

/**
 * Book a draw. Writes the local mirror either way, so a booking made without a
 * session (the demo skip path) still reads back on the confirmation screen.
 *
 * Returns true when the booking reached the server.
 */
export async function bookAppointment(appointment: LabAppointment): Promise<boolean> {
  saveAppointment(appointment);
  try {
    const res = await fetch(apiUrl('/api/me/appointments'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({
        scheduledDate: appointment.date,
        timeSlot: appointment.time,
        labName: appointment.labName,
        labAddress: appointment.labAddress,
      }),
    });
    return res.ok;
  } catch {
    // A failed booking should never dead-end the walkthrough; the local mirror
    // keeps the flow coherent and the next load will reconcile.
    return false;
  }
}

export async function fetchRetestStatus(): Promise<RetestStatus | null> {
  try {
    const res = await fetch(apiUrl('/api/me/appointments/retest-status'), {
      headers: authHeaders(),
    });
    return res.ok ? ((await res.json()) as RetestStatus) : null;
  } catch {
    return null;
  }
}

export async function fetchAppointments(): Promise<RetestStatus['upcoming'][]> {
  try {
    const res = await fetch(apiUrl('/api/me/appointments'), { headers: authHeaders() });
    return res.ok ? await res.json() : [];
  } catch {
    return [];
  }
}
