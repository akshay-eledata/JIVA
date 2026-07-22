// Next draw card (F1, the retest loop).
export const NEXT_DRAW_LABELS = {
  BOOKED_TITLE: 'Your next lab visit',
  BOOKED_TODAY: 'Today',
  BOOKED_TOMORROW: 'Tomorrow',
  BOOKED_IN_DAYS: 'In {n} days',
  BOOKED_PREP: 'Come in fasted, water only, and bring a photo ID.',
  BOOKED_RESCHEDULE: 'Reschedule',

  DUE_TITLE: 'Time to book your next draw',
  DUE_BODY: 'It has been about {n} months since your last visit. A second draw is what turns a single snapshot into a trend you can act on.',
  DUE_BUTTON: 'Book my next visit',
  DUE_PILL: 'Due now',
  DUE_PILL_OVERDUE: '{n} days overdue',

  WAITING_TITLE: 'Your next draw is not booked yet',
  WAITING_BODY: 'Your last draw was on {date}. We suggest testing again around {due}, and you can book it whenever you are ready.',
  WAITING_BUTTON: 'Book my next visit',
  WAITING_PILL: 'In {n} days',

  NONE_TITLE: 'Book your first lab visit',
  NONE_BODY: 'Your results start with a single blood draw. Pick a day and a nearby site whenever you are ready.',
  NONE_BUTTON: 'Book my visit',

  VISIT_LABEL: 'Draw {n}',
} as const;

/** Fills {name} placeholders in the strings above. */
export const fill = (template: string, values: Record<string, string | number>): string =>
  template.replace(/\{(\w+)\}/g, (_, key) => String(values[key] ?? ''));
