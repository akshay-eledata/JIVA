export const OPTION5_LABELS = {
  HERO_EYEBROW: 'Mission control for your biology',
  HERO_TITLE: 'Every system. Every signal. One screen.',
  HERO_SUBTITLE:
    '100+ biomarkers streamed into a living map of your body: ten systems, one biological age, and a physician-led plan that updates with every retest.',
  CTA_PRIMARY: 'Get Started',
  CTA_SECONDARY: 'Sign in',
  ORBIT_GAUGE_LABEL: 'Bio Age',
  ORBIT_GAUGE_VALUE: 34,
  ORBIT_CHIPS: ['ApoB', 'hs-CRP', 'HbA1c', 'TSH', 'Vit D', 'eGFR'],
  HERO_CARDS: [
    { label: 'Inflammation', value: 'Optimal', trend: '▼ 38% this cycle' },
    { label: 'Metabolic', value: 'On watch', trend: 'HbA1c 5.6%' },
  ],

  ECG_TITLE: 'Your body broadcasts. We tune in.',
  ECG_SUBTITLE:
    'A routine physical samples a handful of markers. Jiva listens to more than a hundred, then plots every one against where it should be for you.',

  BOARD_TITLE: 'The live systems board',
  BOARD_SUBTITLE: 'A preview of the Vitality Map that ships with every panel.',
  BOARD: {
    AGE_LABEL: 'Biological age',
    AGE_NOTE: '7 years younger than chronological',
    TREND_LABEL: 'Ferritin, 8 months',
    TREND_VALUE: '52 ng/mL',
    SYSTEMS_LABEL: 'Systems in range',
    SYSTEMS_VALUE: 8,
    SYSTEMS_SUFFIX: '/10',
    LOAD_LABEL: 'Markers by system',
    PLAN_TITLE: 'Next best actions',
    PLAN_ITEMS: ['Omega-3 with dinner', 'Zone 2, 3x weekly', 'Sleep window 10:30pm'],
  },

  SYSTEMS_TITLE: 'Ten systems under continuous watch',

  STATS: [
    { value: 100, suffix: '+', label: 'biomarkers per draw' },
    { value: 10, suffix: '', label: 'body systems' },
    { value: 9, suffix: '', label: 'add-on panels' },
    { value: 5, suffix: 'x', label: 'more data than a physical' },
  ],

  QUOTES_TITLE: 'Signals from members',
  QUOTES_ROW_A: [
    'My inflammation markers dropped in one retest cycle.',
    'Finally, lab results that read like a plan.',
    'I know my biological age. My gym does not.',
    'The yoga plan actually fits my results.',
  ],
  QUOTES_ROW_B: [
    'Ten systems, one map. It just makes sense.',
    'My doctor loved the follow-up comparison.',
    'Prevention stopped being a buzzword for me.',
    'The intake took minutes. The insight lasted months.',
  ],

  CTA_TITLE: 'Put your biology on the board.',
  CTA_SUBTITLE: 'One intake questionnaire, one draw, and mission control goes live.',
  FOOTER_COPYRIGHT: '© 2025 Jiva, Inc. All rights reserved.',
} as const;
