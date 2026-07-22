export const OPTION10_LABELS = {
  HERO_EYEBROW: 'The product is the pitch',
  HERO_TITLE_PREFIX: 'Know your',
  HERO_ROTATING: ['heart.', 'thyroid.', 'hormones.', 'kidneys.', 'future.'],
  HERO_SUBTITLE:
    'This page is a working preview of Jiva. Scroll and the product walks you through itself: the Vitality Map, the trends, and the plan.',
  CTA_PRIMARY: 'Get Started',
  CTA_SECONDARY: 'Sign in',

  TOUR_TITLE: 'A guided lap of your Vitality Map',
  TOUR_STEPS: [
    {
      id: 'map',
      step: 'Stop 1',
      title: 'Ten systems at a glance',
      desc: 'Every draw lands here first: ten functional body systems, each scored and colored so you can see where to look without reading a single number.',
    },
    {
      id: 'trend',
      step: 'Stop 2',
      title: 'Any marker, over time',
      desc: 'Tap into a system and every biomarker charts itself against your history and your optimal range, not just the lab default.',
    },
    {
      id: 'plan',
      step: 'Stop 3',
      title: 'The plan writes itself',
      desc: 'Food, supplements, movement, and therapeutic yoga, generated from your results and rewritten after every retest.',
    },
  ],
  TOUR_SYSTEMS: [
    { name: 'Heart', score: 92 },
    { name: 'Metabolic', score: 78 },
    { name: 'Thyroid', score: 95 },
    { name: 'Liver', score: 88 },
    { name: 'Kidney', score: 90 },
    { name: 'Immune', score: 71 },
  ],
  TOUR_PLAN: ['Mediterranean base diet', 'Omega-3 2g daily', 'Zone 2 cardio, 3x weekly', 'Yoga nidra before bed'],

  SPOTLIGHT_TITLE: 'Built like a product, not a pamphlet',
  SPOTLIGHT_CARDS: [
    { title: '100+ biomarkers', desc: 'Five times more than a routine physical, from one draw.' },
    { title: 'Physician-led', desc: 'Every report reviewed and written in plain language.' },
    { title: 'Ten systems', desc: 'Results organized the way your body actually works.' },
    { title: 'Nine add-on panels', desc: 'Heart, hormones, thyroid, nutrition, stress, and more.' },
    { title: 'Retest built in', desc: 'A follow-up panel proves what changed in 3 to 6 months.' },
    { title: 'Yoga and movement', desc: 'Therapeutic routines matched to your biology.' },
  ],

  TABS_TITLE: 'Watch a marker draw itself',
  TABS: [
    { key: 'Heart', label: 'Heart', series: [88, 92, 90, 95, 97, 99, 102, 104], unit: 'ApoB percentile' },
    { key: 'Metabolic', label: 'Metabolic', series: [61, 60, 66, 70, 74, 73, 78, 82], unit: 'HbA1c percentile' },
    { key: 'Hormones', label: 'Hormones', series: [55, 58, 62, 61, 67, 72, 75, 79], unit: 'Free T percentile' },
  ],

  STATS: [
    { value: 100, suffix: '+', label: 'biomarkers per draw' },
    { value: 10, suffix: '', label: 'body systems' },
    { value: 3, suffix: '', label: 'tour stops above' },
    { value: 1, suffix: '', label: 'plan that adapts' },
  ],

  QUOTES: [
    'The homepage demoed the product before I even signed up.',
    'I knew exactly what I was buying. Then it looked exactly like this.',
    'The trends view sold me in one scroll.',
    'Finally a health product that shows instead of promises.',
  ],

  CTA_TITLE: 'Take the wheel',
  CTA_SUBTITLE: 'Ten minutes of intake, one draw, and this dashboard becomes yours.',
  FOOTER_COPYRIGHT: '© 2025 Jiva, Inc. All rights reserved.',
} as const;
