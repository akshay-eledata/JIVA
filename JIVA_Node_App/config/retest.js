/**
 * Retest cadence (F1).
 *
 * The retest loop is the retention engine of this category, so the interval is
 * a single named constant rather than a number sprinkled through the code.
 *
 * 180 days matches the mainstream cadence: Function bundles a mid-year retest
 * into its membership and Marek requires one at least every 6 months. The
 * quarterly players (Lifeforce, Fountain Life) sit at 90. Change the number
 * here and the dashboard card, the due-date maths and the reminder copy all
 * follow. See Data/Competitor_Survey.md section 4.4.
 */
const RETEST_INTERVAL_DAYS = 180;

/** Days before the due date that we start nudging the patient to rebook. */
const RETEST_REMINDER_WINDOW_DAYS = 30;

/** Add `days` to a yyyy-mm-dd string and return the same format. */
function addDays(dateOnly, days) {
  const d = new Date(`${dateOnly}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Whole days from today (UTC) to a yyyy-mm-dd date. Negative means past. */
function daysUntil(dateOnly) {
  const target = new Date(`${dateOnly}T00:00:00Z`).getTime();
  const today = new Date(`${new Date().toISOString().slice(0, 10)}T00:00:00Z`).getTime();
  return Math.round((target - today) / 86400000);
}

module.exports = {
  RETEST_INTERVAL_DAYS,
  RETEST_REMINDER_WINDOW_DAYS,
  addDays,
  daysUntil,
};
