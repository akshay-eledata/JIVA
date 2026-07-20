// Movement + Therapeutic Yoga library content.
//
// Placeholder data for the Movement tab (Exercise) and the Therapeutic Yoga tab
// (Yoga, Breathwork, Meditation). The Exercise section is additionally
// populated at runtime from the engine's `exercise_recommendations`; everything
// else is static placeholder content until the engine generates yoga /
// breathwork / meditation plans. Keep MovementItem stable — swapping
// placeholders for engine output later should be a data change only, not a
// component change.

import Yoga1 from '../../assets/yoga1.svg';
import Yoga2 from '../../assets/yoga 2.svg';
import Yoga3 from '../../assets/yoga 3.svg';
import Yoga4 from '../../assets/yoga 4.svg';
import Lotus from '../../assets/Lotus.svg';
import Dumbell from '../../assets/Dumbell.svg';

export type MovementCategory = 'exercise' | 'yoga' | 'breathwork' | 'meditation';

export interface MovementStep {
  caption: string;
  img?: string;
}

export interface MovementItem {
  id: string;
  category: MovementCategory;
  title: string;
  short: string;                                   // one-line teaser on the card
  media: { type: 'video' | 'audio' | 'image'; poster?: string; src?: string };
  why: string;                                     // why it's important
  how: string;                                     // how it works
  frequency: string;                               // how often to do it
  duration?: string;
  steps?: MovementStep[];                          // breathwork poses / sequence
}

export const MOVEMENT_CATEGORIES: { id: MovementCategory; label: string; blurb: string }[] = [
  { id: 'exercise', label: 'Exercise', blurb: 'Resistance, strength training and HIIT to build metabolic and cardiovascular resilience.' },
  { id: 'yoga', label: 'Yoga', blurb: 'Guided flows to improve mobility, balance and stress resilience.' },
  { id: 'breathwork', label: 'Breathwork', blurb: 'Structured breathing patterns to calm the nervous system and improve focus.' },
  { id: 'meditation', label: 'Meditation', blurb: 'Guided audio and video sessions to lower stress and support recovery.' },
];

// Placeholder Exercise cards. These sit alongside the real engine-generated
// exercise recommendations inside the Exercise subsection.
export const EXERCISE_ITEMS: MovementItem[] = [
  {
    id: 'ex-strength', category: 'exercise', title: 'Full-Body Strength',
    short: 'Compound resistance training',
    media: { type: 'video', poster: Dumbell },
    why: 'Building lean muscle improves insulin sensitivity and glucose disposal — directly supporting healthier metabolic and blood-sugar markers.',
    how: 'Compound lifts (squat, hinge, push, pull) recruit large muscle groups, driving strength and metabolic adaptation over time.',
    frequency: '2–3 sessions per week, 30–40 minutes, with a rest day between sessions.',
    duration: '30–40 min',
  },
  {
    id: 'ex-hiit', category: 'exercise', title: 'HIIT Intervals',
    short: 'Short bursts, big cardiovascular return',
    media: { type: 'video', poster: Dumbell },
    why: 'High-intensity intervals raise VO₂ max and improve how efficiently your body clears blood sugar and fats.',
    how: 'Alternating short maximal efforts with recovery pushes the cardiovascular system harder than steady cardio in less time.',
    frequency: '1–2 sessions per week, 15–20 minutes, on non-consecutive days.',
    duration: '15–20 min',
  },
  {
    id: 'ex-zone2', category: 'exercise', title: 'Zone 2 Cardio',
    short: 'Easy, conversational-pace endurance',
    media: { type: 'video', poster: Dumbell },
    why: 'Low-intensity aerobic work builds mitochondrial density and is the foundation of long-term metabolic and heart health.',
    how: 'Sustained effort at a pace where you can still hold a conversation trains fat oxidation and aerobic capacity.',
    frequency: '2–4 sessions per week, 30–45 minutes at an easy pace.',
    duration: '30–45 min',
  },
];

export const YOGA_ITEMS: MovementItem[] = [
  {
    id: 'yoga-hatha', category: 'yoga', title: 'Hatha for Mobility',
    short: 'Slow, held postures',
    media: { type: 'video', poster: Yoga1 },
    why: 'Gentle held postures ease stiffness and improve range of motion, which supports recovery and lowers stress hormones.',
    how: 'Longer holds lengthen connective tissue and cue slow, steady breathing that shifts you toward a calmer state.',
    frequency: '3–4 sessions per week, 20–30 minutes.',
    duration: '20–30 min',
  },
  {
    id: 'yoga-vinyasa', category: 'yoga', title: 'Vinyasa Flow',
    short: 'Breath-linked movement',
    media: { type: 'video', poster: Yoga2 },
    why: 'A flowing sequence gently raises the heart rate while building balance and full-body coordination.',
    how: 'Moving from pose to pose in time with the breath blends light cardio with mobility and mindfulness.',
    frequency: '2–3 sessions per week, 25–35 minutes.',
    duration: '25–35 min',
  },
  {
    id: 'yoga-restorative', category: 'yoga', title: 'Restorative Yoga',
    short: 'Deep relaxation, supported poses',
    media: { type: 'video', poster: Yoga3 },
    why: 'Fully supported postures activate the rest-and-digest response, helping lower cortisol and improve sleep quality.',
    how: 'Props hold you in comfortable positions so muscles fully release and the nervous system settles.',
    frequency: '2–3 evenings per week, 20 minutes, ideally before bed.',
    duration: '20 min',
  },
  {
    id: 'yoga-pranayama', category: 'yoga', title: 'Pranayama Flow',
    short: 'Breath-focused practice',
    media: { type: 'video', poster: Yoga4 },
    why: 'Breath-centred practice trains the diaphragm and calms an overactive stress response.',
    how: 'Coordinated breathing patterns paired with gentle movement improve oxygen exchange and focus.',
    frequency: 'Daily, 10–15 minutes.',
    duration: '10–15 min',
  },
];

export const BREATHWORK_ITEMS: MovementItem[] = [
  {
    id: 'breath-box', category: 'breathwork', title: 'Box Breathing',
    short: 'Equal 4-count breathing',
    media: { type: 'image', src: Lotus },
    why: 'Box breathing quickly steadies the nervous system, lowering heart rate and stress in a few minutes.',
    how: 'Equal-length inhale, hold, exhale and hold balances oxygen and CO₂ and signals safety to the brain.',
    frequency: '1–2 times daily, or any time you feel stressed, 4–5 minutes.',
    duration: '4–5 min',
    steps: [
      { caption: 'Sit upright, shoulders relaxed, one hand on your belly.', img: Lotus },
      { caption: 'Inhale slowly through the nose for 4 seconds.' },
      { caption: 'Hold your breath for 4 seconds.' },
      { caption: 'Exhale gently through the mouth for 4 seconds.' },
      { caption: 'Hold empty for 4 seconds, then repeat for 4–5 rounds.' },
    ],
  },
  {
    id: 'breath-478', category: 'breathwork', title: '4-7-8 Breathing',
    short: 'Calming, longer exhale',
    media: { type: 'image', src: Lotus },
    why: 'A longer exhale strongly activates the relaxation response, making this a good pre-sleep tool.',
    how: 'Extending the out-breath relative to the in-breath tips the nervous system toward rest-and-digest.',
    frequency: 'Twice daily, especially before sleep, 4 cycles.',
    duration: '3–4 min',
    steps: [
      { caption: 'Sit or lie down comfortably with a straight spine.', img: Lotus },
      { caption: 'Inhale quietly through the nose for 4 seconds.' },
      { caption: 'Hold the breath for 7 seconds.' },
      { caption: 'Exhale completely through the mouth for 8 seconds.' },
      { caption: 'Repeat for 4 full cycles.' },
    ],
  },
  {
    id: 'breath-diaphragm', category: 'breathwork', title: 'Diaphragmatic Breathing',
    short: 'Deep belly breathing',
    media: { type: 'image', src: Lotus },
    why: 'Belly breathing improves oxygen exchange and trains a fuller, calmer breathing pattern day to day.',
    how: 'Letting the belly rise on the inhale engages the diaphragm instead of shallow chest muscles.',
    frequency: 'Daily, 5–10 minutes.',
    duration: '5–10 min',
    steps: [
      { caption: 'Lie on your back, knees bent, one hand on chest and one on belly.', img: Lotus },
      { caption: 'Inhale through the nose so the belly hand rises and the chest hand stays still.' },
      { caption: 'Exhale slowly through pursed lips, feeling the belly fall.' },
      { caption: 'Continue for 5–10 minutes at an easy pace.' },
    ],
  },
];

export const MEDITATION_ITEMS: MovementItem[] = [
  {
    id: 'med-bodyscan', category: 'meditation', title: 'Body Scan',
    short: 'Guided audio · 10 min',
    media: { type: 'audio' },
    why: 'A body scan releases physical tension and lowers stress hormones that can affect blood pressure and sleep.',
    how: 'Moving attention slowly through the body interrupts the stress loop and brings you into the present.',
    frequency: 'Daily, 10 minutes, morning or evening.',
    duration: '10 min',
  },
  {
    id: 'med-loving', category: 'meditation', title: 'Loving-Kindness',
    short: 'Guided audio · 12 min',
    media: { type: 'audio' },
    why: 'Cultivating warmth toward yourself and others is linked to reduced inflammation markers and better mood.',
    how: 'Silently repeating goodwill phrases shifts emotional tone and calms the stress response.',
    frequency: '3–4 times per week, 12 minutes.',
    duration: '12 min',
  },
  {
    id: 'med-sleep', category: 'meditation', title: 'Guided Sleep',
    short: 'Guided audio · 20 min',
    media: { type: 'audio' },
    why: 'Better sleep improves nearly every biomarker — from glucose control to recovery and immune function.',
    how: 'A slow, soothing narration guides your breath and attention until you drift off.',
    frequency: 'Nightly, as you settle into bed.',
    duration: '20 min',
  },
  {
    id: 'med-focus', category: 'meditation', title: 'Focus Meditation',
    short: 'Guided video · 8 min',
    media: { type: 'video', poster: Lotus },
    why: 'Short focus practice trains attention and lowers the mental noise that drives chronic stress.',
    how: 'Resting attention on the breath — and gently returning when it wanders — strengthens focus over time.',
    frequency: 'Daily, 8 minutes.',
    duration: '8 min',
  },
];

export const MOVEMENT_LIBRARY: Record<MovementCategory, MovementItem[]> = {
  exercise: EXERCISE_ITEMS,
  yoga: YOGA_ITEMS,
  breathwork: BREATHWORK_ITEMS,
  meditation: MEDITATION_ITEMS,
};
