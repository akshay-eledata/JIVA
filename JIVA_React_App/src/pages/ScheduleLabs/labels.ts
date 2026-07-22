// Lab scheduling page labels.
export const SCHEDULE_LABS_LABELS = {
  TITLE: 'Book your first lab visit',
  SUBTITLE: 'Pick a day that works, tell us roughly where you are, and we will show you the closest draw sites.',

  GUIDANCE_TITLE: 'Before you book',
  GUIDANCE_FAST_TITLE: 'Come in fasted',
  GUIDANCE_FAST_BODY: 'No food for 10 to 12 hours beforehand. Water is fine and encouraged.',
  GUIDANCE_MORNING_TITLE: 'Aim for a morning slot',
  GUIDANCE_MORNING_BODY: 'Hormone and glucose markers are most stable before 11 AM, so early visits give us the cleanest picture.',

  DATE_TITLE: 'Choose a date',
  DATE_HELPER: 'Your second visit gets scheduled later, once your first results are back.',
  DATE_OTHER: 'Or pick another date',

  ADDRESS_TITLE: 'Where should we look?',
  ADDRESS_HELPER: 'A street address, neighborhood, or ZIP code is enough.',
  ADDRESS_PLACEHOLDER: 'e.g. 240 Elm Street, Austin, TX',
  ADDRESS_BUTTON: 'Find nearby labs',
  ADDRESS_SEARCHING: 'Searching...',

  RESULTS_TITLE: 'Draw sites near you',
  RESULTS_DEMO_NOTE: 'Demo build: these are sample locations. Real availability appears once our lab partner is connected.',
  RESULTS_SLOTS: 'Available times',
  RESULTS_EMPTY: 'Enter an address above to see the draw sites closest to you.',

  CONFIRM: 'Confirm appointment',
  CONFIRM_HINT: 'Choose a location and a time to continue.',
  MILES_AWAY: 'miles away',

  // Retest mode: the same screen, booking a follow up draw instead of the first.
  RETEST_TITLE: 'Book your next lab visit',
  RETEST_SUBTITLE: 'Your next draw is what turns a single snapshot into a trend. Pick a day and a draw site and we will take it from there.',
  RETEST_DATE_HELPER: 'Most people retest about every six months, which is long enough for changes to show up in your markers.',
  RETEST_AGAIN_TITLE: 'Book where you went last time',
  RETEST_AGAIN_BODY: 'Your last draw was at',
  RETEST_AGAIN_BUTTON: 'Use this lab',
  RETEST_BACK: 'Back to dashboard',
} as const;
