export const OPTION2_LABELS = {
  HERO_EYEBROW: 'Physician-led preventive diagnostics',
  HERO_TITLE: 'Measure everything. Miss nothing.',
  HERO_SUBTITLE:
    '100+ biomarkers, ten body systems, one living picture of your health that sharpens with every test.',
  CTA_PRIMARY: 'Get Started',
  CTA_SECONDARY: 'Sign in',
  CHART_CHIP_LABEL: 'hs-CRP, last 12 months',
  CHART_CHIP_VALUE: '0.8 mg/L · Optimal',

  JOURNEY_EYEBROW: 'The protocol',
  JOURNEY_TITLE: 'How Jiva works',
  JOURNEY_STEPS: [
    {
      num: '01',
      title: 'Baseline draw',
      desc: 'One blood draw covers the Basic Panel of 100+ advanced biomarkers, with add-on panels for heart, hormones, thyroid, nutrition, stress, and immunity.',
    },
    {
      num: '02',
      title: 'Physician analysis',
      desc: 'Your results and intake questionnaire are reviewed through a physician-led clinical engine, not a generic reference range.',
    },
    {
      num: '03',
      title: 'Your Vitality Map',
      desc: 'Biological age, ten functional body systems, and every biomarker explained in plain language. You see exactly where you stand.',
    },
    {
      num: '04',
      title: 'Act, then retest',
      desc: 'Food, supplements, movement, and yoga, prescribed for your biology. A follow-up panel in 3 to 6 months proves what changed.',
    },
  ],

  BENTO_TITLE: 'Everything your annual physical misses',
  BENTO: {
    AGE_LABEL: 'Biological age',
    AGE_VALUE: 34,
    AGE_NOTE: '7 years younger than chronological',
    PANELS_TITLE: 'One draw, nine add-on panels',
    PANELS_DESC: 'Heart, hormones, thyroid, nutrition, stress and aging, inflammation and immunity, and more.',
    PLAN_TITLE: 'A plan, not a PDF',
    PLAN_DESC: 'Food, supplement, movement, and therapeutic yoga plans built from your results.',
    PHYSICIAN_TITLE: 'Physician-led',
    PHYSICIAN_DESC: 'Clinical notes written by doctors, in language you can actually use.',
    RETEST_TITLE: 'Progress you can measure',
    RETEST_DESC: 'Vitality Map 2 compares every marker against your baseline.',
  },

  STATS: [
    { value: 100, suffix: '+', label: 'biomarkers per draw' },
    { value: 10, suffix: '', label: 'body systems' },
    { value: 9, suffix: '', label: 'add-on panels' },
    { value: 5, suffix: 'x', label: 'more data than a physical' },
  ],

  QUOTES_TITLE: 'What members say',
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

  CTA_TITLE: 'Your baseline is waiting.',
  CTA_SUBTITLE: 'Start with the intake questionnaire. Your first panel takes one draw.',
  FOOTER_COPYRIGHT: '© 2025 Jiva, Inc. All rights reserved.',
} as const;
