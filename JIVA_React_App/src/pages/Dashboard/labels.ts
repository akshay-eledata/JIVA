// Dashboard Page Labels
//
// The dashboard answers two questions: is my draw confirmed, and what do I get
// out of it. Copy is written for both the waiting state (no report yet) and the
// delivered state, so most entries come in a PENDING/READY pair.
export const DASHBOARD_LABELS = {
  // Journey strip
  JOURNEY_TITLE: 'From draw to report',
  JOURNEY_SUBTITLE_PENDING: 'Where your panel is in the process right now.',
  JOURNEY_SUBTITLE_READY: 'Your latest panel has been through the whole process.',
  STEP_BOOKED: 'Panel booked',
  STEP_BOOKED_NOTE: 'Paid and confirmed',
  STEP_DRAW: 'Blood draw',
  STEP_DRAW_NOTE_BOOKED: 'At your chosen lab',
  STEP_DRAW_NOTE_UNBOOKED: 'Not booked yet',
  STEP_LAB: 'Lab analysis',
  STEP_LAB_NOTE: 'About 3 days after your draw',
  STEP_ENGINE: 'JIVA engine',
  STEP_ENGINE_NOTE: 'Markers read together, not one by one',
  STEP_REPORT: 'Report ready',
  STEP_REPORT_NOTE: 'About a week after your draw',

  // Deliverables
  DELIVER_TITLE_PENDING: 'What you get when your results land',
  DELIVER_SUBTITLE_PENDING:
    'The JIVA engine reads every marker against the others, not in isolation. This is what it produces from your draw.',
  DELIVER_TITLE_READY: 'What the engine found',
  DELIVER_SUBTITLE_READY: 'From your most recent panel. Open any card to see it in full.',

  BIO_AGE_TITLE: 'Your biological age',
  BIO_AGE_PENDING: 'How old your body reads from its chemistry, set against your calendar age.',
  MARKERS_TITLE: 'Every marker, placed in range',
  MARKERS_PENDING: 'Each result sits on an optimal range, not just the pass or fail cutoff a lab prints.',
  SYSTEMS_TITLE: 'Your body, by system',
  SYSTEMS_PENDING: 'Markers grouped into body systems, so you can see which areas need attention.',
  FINDINGS_TITLE: 'Ranked clinical findings',
  FINDINGS_PENDING: 'Patterns across several markers at once, ranked by confidence, with the labs behind each one.',
  FOOD_TITLE: 'What to eat, what to skip',
  FOOD_PENDING: 'A food plan built around your findings and the preferences you gave us.',
  PLAN_TITLE: 'Exercise and supplements',
  PLAN_PENDING: 'Movement and supplement guidance tied to what your results actually show.',

  WAITING_NOTE: 'Nothing for you to do while you wait. We will email you the moment your report is ready.',
} as const;
