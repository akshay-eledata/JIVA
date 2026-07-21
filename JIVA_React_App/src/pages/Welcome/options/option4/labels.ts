export const OPTION4_LABELS = {
  HERO_EYEBROW: 'Precision wellness, in plain daylight',
  HERO_TITLE: 'Your health, in high resolution.',
  HERO_SUBTITLE:
    'Scroll through what one blood draw, ten body systems, and a physician-led plan can tell you about the next decade of your life.',
  CTA_PRIMARY: 'Get Started',
  CTA_SECONDARY: 'Sign in',
  HERO_HINT: 'Scroll to explore',

  CHAPTERS_TITLE: 'One draw. Three moves.',
  CHAPTERS: [
    {
      id: 'test',
      title: 'Test deeply',
      desc: 'The Basic Panel covers 100+ advanced biomarkers, five times more than a routine physical. Add-on panels tune the picture to your goals.',
      visual: 'gauge',
    },
    {
      id: 'read',
      title: 'Read clearly',
      desc: 'A physician-led engine turns raw values into your Vitality Map: biological age plus ten functional body systems, explained in plain language.',
      visual: 'chart',
    },
    {
      id: 'act',
      title: 'Act precisely',
      desc: 'Food, supplements, movement, and therapeutic yoga, matched to your biology. Retest in 3 to 6 months and watch the numbers move.',
      visual: 'plan',
    },
  ],
  VISUAL_GAUGE_LABEL: 'Biological Age',
  VISUAL_GAUGE_VALUE: 34,
  VISUAL_CHART_LABEL: 'Ferritin, two panels',
  VISUAL_PLAN_ITEMS: ['Mediterranean base diet', 'Vitamin D3 2000 IU', 'Zone 2, 3x weekly', 'Therapeutic yoga, 2x'],

  GALLERY_TITLE: 'Ten systems, one horizontal sweep',
  GALLERY_HINT: 'Keep scrolling',

  STATS: [
    { value: 100, suffix: '+', label: 'biomarkers per draw' },
    { value: 10, suffix: '', label: 'body systems mapped' },
    { value: 9, suffix: '', label: 'add-on panels' },
    { value: 2, suffix: '', label: 'tests per year' },
  ],

  CTA_TITLE: 'See your baseline in full resolution',
  CTA_SUBTITLE: 'Start with the intake questionnaire. One draw does the rest.',
  FOOTER_COPYRIGHT: '© 2025 Jiva, Inc. All rights reserved.',
} as const;
