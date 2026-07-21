// The lab appointment booked at the end of onboarding.
//
// Demo build: no lab partner is connected, so there is nothing to persist
// server side yet. Keeping it in localStorage lets the success screen show the
// booking back. Move this to an API call once the partner integration lands.

const KEY = 'jiva_lab_appointment';

export interface LabAppointment {
  /** ISO yyyy-mm-dd, useful once this goes to the backend. */
  date: string;
  /** Human readable version of the same day. */
  dateLabel: string;
  time: string;
  labName: string;
  labAddress: string;
}

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
