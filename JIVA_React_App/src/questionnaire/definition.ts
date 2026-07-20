// The JIVA patient intake questionnaire, transcribed from Data/Questionnaire.docx.
// phase: 'pre'     — asked in the pre-payment intake wizard.
// phase: 'anytime' — red questions in the doc; answerable any time after login.

import { QuestionnaireSection, Question } from './types';
import {
  ACTIVITY_OPTIONS, SUPPLEMENT_OPTIONS, CONDITION_OPTIONS, RELATIVE_OPTIONS,
} from './options';

export const INTAKE_SECTIONS: QuestionnaireSection[] = [
  {
    id: 'lifestyle',
    title: 'Lifestyle & Habits',
    subtitle: 'Help us understand your daily rhythm',
    questions: [
      {
        kind: 'single', id: 'sleep_hours', phase: 'pre',
        label: 'How would you describe your sleep?',
        helper: 'Hours per night on average',
        options: ['Less than 5', '5-6 hrs', '6-7 hrs', '7-8 hrs', '8-9 hrs', '9+ hrs'],
      },
      {
        kind: 'single', id: 'work_shift', phase: 'anytime',
        label: 'Primary work schedule',
        options: ['Day shift', 'Night shift', 'Rotating', 'Flexible'],
      },
      {
        kind: 'single', id: 'occupation_type', phase: 'anytime',
        label: 'What best describes your occupation?',
        options: [
          'Fully sedentary', 'Mostly desk work', 'Mixed sitting/standing',
          'Actively on feet', 'Heavy physical labor', 'Frequent travel',
        ],
        allowOther: true,
      },
      {
        kind: 'yesno', id: 'meditates', phase: 'pre',
        label: 'Do you practice meditation or breathwork?',
      },
      {
        kind: 'multi', id: 'meditation_type', phase: 'pre', sub: true,
        label: 'Which practices do you use?',
        showIf: { questionId: 'meditates', equals: 'Yes' },
        options: [
          'Mindfulness', 'Breathwork / Pranayama', 'Body scan', 'Transcendental',
          'Guided visualization', 'Wim Hof method', 'Prayer / spiritual',
        ],
        allowOther: true,
      },
      {
        kind: 'text', id: 'meditation_frequency', phase: 'pre', sub: true,
        label: 'How often and for how long?',
        showIf: { questionId: 'meditates', equals: 'Yes' },
        placeholder: 'e.g. 10 minutes every morning',
      },
      {
        kind: 'single', id: 'alcohol_frequency', phase: 'pre',
        label: 'How often do you consume alcohol?',
        options: ['Never', 'Rarely (social only)', '1-2x per week', '3-5x per week', 'Daily'],
      },
      {
        kind: 'yesno', id: 'tobacco_use', phase: 'pre',
        label: 'Do you use tobacco or nicotine products?',
      },
      {
        kind: 'multi', id: 'tobacco_types', phase: 'pre', sub: true,
        label: 'Which type(s)?',
        showIf: { questionId: 'tobacco_use', equals: 'Yes' },
        options: [
          'Cigarettes', 'Cigars', 'Vaping / e-cig', 'Chewing tobacco',
          'Nicotine patches/gum',
        ],
        allowOther: true,
      },
      {
        kind: 'text', id: 'tobacco_notes', phase: 'pre', sub: true,
        label: 'Frequency / notes',
        showIf: { questionId: 'tobacco_use', equals: 'Yes' },
        placeholder: 'e.g. a few cigarettes on weekends',
      },
      {
        kind: 'yesno', id: 'recreational_substances', phase: 'pre',
        label: 'Do you use recreational substances (cannabis, etc.)?',
      },
      {
        kind: 'text', id: 'recreational_substance_details', phase: 'pre', sub: true,
        label: 'Type and frequency',
        showIf: { questionId: 'recreational_substances', equals: 'Yes' },
        placeholder: 'e.g. cannabis edibles, once a month',
      },
      {
        kind: 'slider', id: 'stress_level', phase: 'pre',
        label: 'How would you rate your stress level in daily life?',
        min: 1, max: 10, defaultValue: 5,
        minLabel: 'Very low', midLabel: 'Moderate', maxLabel: 'Very high',
      },
      {
        kind: 'text', id: 'lifestyle_notes', phase: 'anytime', multiline: true,
        label: 'Anything else about your lifestyle we should know?',
        helper: 'Include anything not covered above (work stress, travel, unique circumstances, etc.)',
      },
    ],
  },
  {
    id: 'nutrition',
    title: 'Nutrition & Food',
    subtitle: 'We use this to personalize your dietary recommendations',
    questions: [
      {
        kind: 'multi', id: 'diet_type', phase: 'pre',
        label: 'What best describes your current diet?',
        options: [
          'Omnivore', 'Pescatarian', 'Vegetarian', 'Vegan', 'Ketogenic',
          'Paleo / Ancestral', 'Mediterranean', 'Carnivore', 'Intermittent fasting',
          'High protein', 'No specific diet',
        ],
        allowOther: true,
      },
      {
        kind: 'yesno', id: 'food_allergies', phase: 'pre',
        label: 'Do you have any food allergies?',
      },
      {
        kind: 'multi', id: 'food_allergy_list', phase: 'pre', sub: true,
        label: 'Which allergens?',
        showIf: { questionId: 'food_allergies', equals: 'Yes' },
        options: [
          'Gluten / wheat', 'Dairy / lactose', 'Tree nuts', 'Peanuts', 'Shellfish',
          'Fish', 'Eggs', 'Soy', 'FODMAP sensitivity', 'Nightshades',
        ],
      },
      {
        kind: 'text', id: 'food_allergy_details', phase: 'pre', sub: true,
        label: 'Other allergies',
        showIf: { questionId: 'food_allergies', equals: 'Yes' },
        placeholder: 'Anything not listed above',
      },
      {
        kind: 'text', id: 'disliked_foods', phase: 'anytime', multiline: true,
        label: 'Foods you dislike or never want recommended',
        helper: 'These will never be suggested in meal plans',
        placeholder: 'e.g. mushrooms, okra, blue cheese',
      },
      {
        kind: 'multi', id: 'cultural_food_restrictions', phase: 'anytime',
        label: 'Are there cultural, religious, or ethical food restrictions?',
        options: ['Halal', 'Kosher', 'Hindu vegetarian', 'No beef', 'No pork', 'None'],
        allowOther: true,
      },
      {
        kind: 'single', id: 'meals_per_day', phase: 'pre',
        label: 'How many meals per day do you typically eat?',
        options: [
          '1 meal', '2 meals', '3 meals', '3 meals + snacks',
          'Grazing / frequent small meals',
        ],
      },
      {
        kind: 'single', id: 'eating_out_frequency', phase: 'anytime',
        label: 'How often do you eat out or order takeout?',
        options: [
          'Rarely (home cooked mostly)', 'A few times a week', 'Most meals out',
          'Always eating out',
        ],
      },
      {
        kind: 'single', id: 'water_intake', phase: 'pre',
        label: 'Daily water intake',
        options: ['Less than 1L', '1-2 L', '2-3 L', '3L+'],
      },
      {
        kind: 'text', id: 'nutrition_goals', phase: 'anytime', multiline: true,
        label: 'Nutrition goals or anything specific you want us to know?',
      },
    ],
  },
  {
    id: 'activity',
    title: 'Physical Activity',
    subtitle: 'Your movement patterns shape your biomarker baselines',
    questions: [
      {
        kind: 'single', id: 'exercise_frequency', phase: 'pre',
        label: 'How often are you physically active?',
        options: [
          'Sedentary (rarely move)', '1-2x per week', '3-4x per week',
          '5-6x per week', 'Daily', 'Twice daily',
        ],
      },
      {
        kind: 'single', id: 'exercise_duration_per_session', phase: 'pre',
        label: 'On active days, how long do you typically exercise?',
        options: [
          'Under 15 min', '15-30 min', '30-45 min', '45-60 min', '60-90 min', '90+ min',
        ],
      },
      {
        kind: 'tags', id: 'exercise_types', phase: 'anytime',
        label: 'What types of activity do you engage in?',
        options: ACTIVITY_OPTIONS,
        placeholder: 'Search activities…',
      },
      {
        kind: 'yesno', id: 'practices_yoga', phase: 'pre',
        label: 'Do you practice yoga?',
      },
      {
        kind: 'multi', id: 'yoga_styles', phase: 'pre', sub: true,
        label: 'Which style(s) resonate?',
        showIf: { questionId: 'practices_yoga', equals: 'Yes' },
        options: [
          'Hatha', 'Vinyasa / Flow', 'Ashtanga', 'Yin / Restorative', 'Kundalini',
          'Bikram / Hot Yoga', 'Power Yoga', 'Prenatal / Therapeutic',
        ],
        optionDescriptions: {
          'Hatha': 'Classical posture-based practice with breath alignment',
          'Vinyasa / Flow': 'Dynamic, breath-synchronized sequences',
          'Ashtanga': 'Structured six-series system with ujjayi breathwork',
          'Yin / Restorative': 'Long passive holds; parasympathetic activation',
          'Kundalini': 'Kriyas, chanting, breathwork; neurohormonal effects',
          'Bikram / Hot Yoga': '26 postures in 40°C heat',
          'Power Yoga': 'Strength-focused athletic adaptation of Ashtanga',
          'Prenatal / Therapeutic': 'Gentle, modifications-based practice',
        },
      },
      {
        kind: 'single', id: 'yoga_experience', phase: 'pre', sub: true,
        label: 'How long have you been practicing yoga?',
        showIf: { questionId: 'practices_yoga', equals: 'Yes' },
        options: [
          'Just starting', 'Under 1 year', '1-3 years', '3-5 years', '5-10 years',
          '10+ years',
        ],
      },
      {
        kind: 'text', id: 'yoga_limitations', phase: 'pre', sub: true,
        label: 'Physical symptoms or limitations in your practice?',
        showIf: { questionId: 'practices_yoga', equals: 'Yes' },
        placeholder: 'e.g. lower back pain in forward folds',
      },
      {
        kind: 'single', id: 'yoga_setting', phase: 'anytime', sub: true,
        label: 'Practice with a teacher/studio, or self-directed?',
        showIf: { questionId: 'practices_yoga', equals: 'Yes' },
        options: [
          'Studio / in-person teacher', 'Online classes', 'Self-directed / home', 'Mixed',
        ],
      },
      {
        kind: 'text', id: 'yoga_goals', phase: 'anytime', sub: true,
        label: 'Current yoga goals',
        showIf: { questionId: 'practices_yoga', equals: 'Yes' },
      },
      {
        kind: 'multi', id: 'fitness_tracking', phase: 'anytime',
        label: 'Do you track any fitness metrics?',
        options: [
          'Heart rate / HRV', 'Steps / distance', 'Sleep score', 'VO₂ max',
          'Calories burned', "I don't track",
        ],
      },
      {
        kind: 'text', id: 'fitness_tracking_device', phase: 'anytime', sub: true,
        label: 'Which device / app?',
        placeholder: 'e.g. Whoop, Oura Ring, Apple Watch, Garmin',
      },
      {
        kind: 'text', id: 'fitness_goals', phase: 'anytime', multiline: true,
        label: 'Current fitness goals',
      },
    ],
  },
  {
    id: 'medical',
    title: 'Medical History',
    subtitle: 'Confidential, used only to personalize your lab panel',
    note: 'All medical information is handled under strict data privacy protocols and is never shared without explicit consent.',
    questions: [
      {
        kind: 'single', id: 'last_doctor_visit', phase: 'pre',
        label: 'When did you last see a physician?',
        options: [
          'Within 6 months', '6-12 months ago', '1-2 years ago',
          'More than 2 years ago', 'Never / unsure',
        ],
      },
      {
        kind: 'yesno', id: 'covid_vaccinated', phase: 'anytime',
        label: 'Did you receive the COVID-19 vaccine?',
      },
      {
        kind: 'multi', id: 'covid_vaccine_type', phase: 'anytime', sub: true,
        label: 'Which vaccine(s)?',
        showIf: { questionId: 'covid_vaccinated', equals: 'Yes' },
        options: [
          'Pfizer-BioNTech', 'Moderna', 'Johnson & Johnson', 'AstraZeneca',
          'Other / unsure',
        ],
      },
      {
        kind: 'text', id: 'covid_vaccine_notes', phase: 'anytime', sub: true,
        label: 'Doses, boosters, or side effects',
        showIf: { questionId: 'covid_vaccinated', equals: 'Yes' },
      },
      {
        kind: 'yesno', id: 'chronic_conditions', phase: 'pre',
        label: 'Do you have any chronic conditions?',
      },
      {
        kind: 'rows', id: 'chronic_condition_list', phase: 'pre', sub: true,
        label: 'Your conditions',
        showIf: { questionId: 'chronic_conditions', equals: 'Yes' },
        addLabel: 'Add condition',
        columns: [
          // ICD-11 autocomplete over free text (per the intake spec: codes are
          // resolved in the back end from whatever the patient types).
          { id: 'condition', label: 'Condition', type: 'icd', placeholder: 'Start typing, e.g. thyroid' },
          { id: 'year_diagnosed', label: 'Year of diagnosis', type: 'text', placeholder: 'e.g. 2019' },
        ],
      },
      {
        kind: 'yesno', id: 'current_medications', phase: 'pre',
        label: 'Are you currently taking any prescription medications?',
      },
      {
        kind: 'text', id: 'medication_details', phase: 'pre', sub: true, multiline: true,
        label: 'List medications and dosage',
        showIf: { questionId: 'current_medications', equals: 'Yes' },
        placeholder: 'e.g. Metformin 500mg twice daily',
      },
      {
        kind: 'yesno', id: 'current_supplements', phase: 'pre',
        label: 'Do you take any supplements or vitamins?',
      },
      {
        kind: 'tags', id: 'supplement_list', phase: 'pre', sub: true,
        label: 'Which supplements?',
        showIf: { questionId: 'current_supplements', equals: 'Yes' },
        options: SUPPLEMENT_OPTIONS,
        placeholder: 'Search supplements…',
      },
      {
        kind: 'text', id: 'supplement_notes', phase: 'pre', sub: true,
        label: 'Any not listed (brand / dosage)',
        showIf: { questionId: 'current_supplements', equals: 'Yes' },
      },
      {
        kind: 'yesno', id: 'uses_cpap', phase: 'pre',
        label: 'Do you use a CPAP or other sleep device?',
      },
      {
        kind: 'text', id: 'cpap_details', phase: 'pre', sub: true,
        label: 'Device type and diagnosis',
        showIf: { questionId: 'uses_cpap', equals: 'Yes' },
        placeholder: 'e.g. diagnosed OSA 2021, ResMed AirSense 10',
      },
      {
        kind: 'yesno', id: 'prior_surgeries', phase: 'pre',
        label: 'Have you had any surgeries?',
      },
      {
        kind: 'text', id: 'surgery_details', phase: 'pre', sub: true, multiline: true,
        label: 'Procedures and approximate year',
        showIf: { questionId: 'prior_surgeries', equals: 'Yes' },
      },
      {
        kind: 'yesno', id: 'prior_hospitalizations', phase: 'pre',
        label: 'Any other hospitalizations or significant medical events?',
      },
      {
        kind: 'text', id: 'hospitalization_details', phase: 'pre', sub: true, multiline: true,
        label: 'Details',
        showIf: { questionId: 'prior_hospitalizations', equals: 'Yes' },
        placeholder: 'e.g. COVID hospitalization 2021, severe pneumonia 2018',
      },
      {
        kind: 'yesno', id: 'recent_lab_tests', phase: 'pre',
        label: 'Have you had any lab tests in the past 12 months?',
      },
      {
        kind: 'text', id: 'recent_lab_details', phase: 'pre', sub: true, multiline: true,
        label: 'Notable results',
        showIf: { questionId: 'recent_lab_tests', equals: 'Yes' },
        placeholder: 'e.g. borderline A1C, low Vitamin D',
      },
      {
        kind: 'yesno', id: 'blood_draw_concerns', phase: 'pre',
        label: 'Do you have concerns about blood draws?',
        helper: 'Lab visits require 10-12 vials per session.',
      },
      {
        kind: 'multi', id: 'blood_draw_concern_list', phase: 'pre', sub: true,
        label: 'What are your concerns?',
        showIf: { questionId: 'blood_draw_concerns', equals: 'Yes' },
        options: [
          'Needle phobia / anxiety', 'Difficult veins', 'History of fainting (vasovagal)',
          'Previous bad experience', 'Blood clotting issues',
        ],
      },
      {
        kind: 'text', id: 'blood_draw_concern_details', phase: 'pre', sub: true,
        label: 'Details',
        showIf: { questionId: 'blood_draw_concerns', equals: 'Yes' },
      },
    ],
  },
  {
    id: 'family',
    title: 'Family History',
    subtitle: 'First-degree relatives shape your genetic risk profile',
    questions: [
      {
        kind: 'multi', id: 'genetic_lineage', phase: 'pre',
        label: 'What is your genetic lineage / ancestry?',
        helper: 'Select all that apply',
        options: [
          'African / Afro-Caribbean', 'Ashkenazi Jewish', 'East Asian', 'South Asian',
          'Southeast Asian', 'European / White', 'Hispanic / Latino',
          'Middle Eastern / North African', 'Indigenous / Native American', 'Mixed / other',
        ],
      },
      {
        kind: 'rows', id: 'family_history', phase: 'pre',
        label: 'Family medical conditions',
        addLabel: 'Add family condition',
        columns: [
          { id: 'condition', label: 'Condition', type: 'icd', placeholder: 'Start typing, e.g. diabetes' },
          { id: 'relationship', label: 'Relative', type: 'select', options: RELATIVE_OPTIONS },
        ],
      },
      {
        kind: 'yesno', id: 'early_onset_disease', phase: 'pre',
        label: 'Have any first-degree relatives had early-onset disease?',
        helper: "e.g. heart attack under 55, cancer under 50, early Alzheimer's",
      },
      {
        kind: 'text', id: 'early_onset_details', phase: 'pre', sub: true, multiline: true,
        label: 'Details',
        showIf: { questionId: 'early_onset_disease', equals: 'Yes' },
      },
      {
        kind: 'yesno', id: 'genetic_testing', phase: 'pre',
        label: 'Have you had any genetic testing done?',
        helper: '23andMe, AncestryDNA, clinical genetics, BRCA, etc.',
      },
      {
        kind: 'text', id: 'genetic_testing_details', phase: 'pre', sub: true,
        label: 'Notable findings (optional)',
        showIf: { questionId: 'genetic_testing', equals: 'Yes' },
      },
    ],
  },
  {
    id: 'goals',
    title: 'Your Health Goals',
    subtitle: 'What matters most to you. This guides your panel design',
    questions: [
      {
        kind: 'multi', id: 'health_interests', phase: 'pre',
        label: 'What are you most interested in understanding about your health?',
        helper: 'Select all that apply. Each unlocks specific biomarker panels',
        options: [
          'Whole body health', 'Heart health', 'Blood sugar & metabolic',
          'Thyroid health', 'Hormone health', 'Fertility', 'Inflammation', 'Gut health',
          'Heavy metal exposure', 'Allergy & immune', "Alzheimer's risk",
          'Cancer monitoring', 'Longevity & aging', 'Nutrient deficiencies',
          'Mental performance', 'Environmental / regional risks',
        ],
        optionDescriptions: {
          'Whole body health': 'Comprehensive baseline',
          'Heart health': 'Lipids, ApoB, Lp(a)',
          'Blood sugar & metabolic': 'Glucose, insulin, A1C',
          'Thyroid health': 'TSH, T3, T4, antibodies',
          'Hormone health': 'Sex hormones, DHEA, cortisol',
          'Fertility': 'AMH, FSH, LH, sperm health',
          'Inflammation': 'hsCRP, IL-6, ESR',
          'Gut health': 'Microbiome, leaky gut markers',
          'Heavy metal exposure': 'Lead, mercury, arsenic',
          'Allergy & immune': 'IgE, autoimmune markers',
          "Alzheimer's risk": 'ApoE4, amyloid precursors',
          'Cancer monitoring': 'CEA, PSA, CA-125, AFP',
          'Longevity & aging': 'Telomeres, NAD+, methylation',
          'Nutrient deficiencies': 'Vitamins, minerals, omega-3',
          'Mental performance': 'Neurotransmitter precursors',
          'Environmental / regional risks': 'Epidemiological exposure',
        },
      },
      {
        kind: 'text', id: 'evaluation_reason', phase: 'pre', multiline: true,
        label: 'Is there a specific health event or symptom that prompted this evaluation?',
      },
      {
        kind: 'text', id: 'optimal_health_vision', phase: 'pre', multiline: true,
        label: 'What does optimal health look like to you in 1 year?',
      },
      {
        kind: 'single', id: 'referral_source', phase: 'pre',
        label: 'How did you hear about JIVA Health?',
        options: [
          'Doctor / physician referral', 'Friend or family', 'Social media',
          'Online search', 'Hospital / clinic', 'Other',
        ],
      },
      {
        kind: 'text', id: 'care_team_notes', phase: 'anytime', multiline: true,
        label: "Anything else you'd like your care team to know before your visit?",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Mind-Body Constitution quiz — all questions are 'anytime' (post-payment).
// Answers are stored under data.constitution.<id>.
// ---------------------------------------------------------------------------

export interface ConstitutionQuestion {
  id: string;
  group: string;
  label: string;
  options: string[];
}

export const CONSTITUTION_QUESTIONS: ConstitutionQuestion[] = [
  {
    id: 'body_type', group: 'Body & weight',
    label: 'Which description fits your natural body type best?',
    options: [
      'I am naturally slim and tend to have a smaller frame.',
      'I have a medium build and tend to stay fairly balanced in weight.',
      'I have a broader or heavier build and gain weight easily.',
    ],
  },
  {
    id: 'weight_pattern', group: 'Body & weight',
    label: 'What usually happens to your weight if you stop paying attention to diet or exercise?',
    options: [
      'I lose weight easily or have trouble keeping it on.',
      'My weight stays fairly steady.',
      'I gain weight easily and it is hard to lose.',
    ],
  },
  {
    id: 'skin_type', group: 'Skin & hair',
    label: 'Which best describes your skin most of the time?',
    options: [
      'Dry, rough, or easily flaky.',
      'Warm, sensitive, or likely to get red or irritated.',
      'Soft, cool, or more oily than dry.',
    ],
  },
  {
    id: 'hair_type', group: 'Skin & hair',
    label: 'Which best describes your hair?',
    options: [
      'Dry, frizzy, or not very thick.',
      'Medium texture, but prone to thinning, breakage, or early graying.',
      'Thick, full, and often more oily.',
    ],
  },
  {
    id: 'appetite', group: 'Appetite & digestion',
    label: 'Which best describes your appetite?',
    options: [
      'It changes a lot; sometimes I’m hungry, sometimes not.',
      'I get hungry strongly and can become irritable if I miss meals.',
      'I have a steady appetite, but digestion can feel slow or heavy.',
    ],
  },
  {
    id: 'digestion', group: 'Appetite & digestion',
    label: 'Which digestion pattern sounds most like you?',
    options: [
      'I often feel bloated, irregular, or constipated.',
      'My digestion feels strong, and I may have loose or frequent bowel movements.',
      'My digestion feels slower, with a sense of heaviness after eating.',
    ],
  },
  {
    id: 'cravings', group: 'Appetite & digestion',
    label: 'What kinds of snacks or foods do you tend to crave?',
    options: [
      'Crunchy or highly flavored snacks.',
      'Cold drinks or cooling foods.',
      'Sweet, creamy, or comfort foods.',
    ],
  },
  {
    id: 'pace', group: 'Energy & movement',
    label: 'How would you describe your usual pace?',
    options: [
      'Fast, restless, or always moving.',
      'Focused, driven, and purposeful.',
      'Steady, calm, and slower paced.',
    ],
  },
  {
    id: 'exercise_relationship', group: 'Energy & movement',
    label: 'What is your usual relationship with exercise or activity?',
    options: [
      'I start quickly but can be inconsistent.',
      'I like goals and perform best when I have a clear target.',
      'I prefer a steady routine and take time to get going.',
    ],
  },
  {
    id: 'sleep_pattern', group: 'Sleep',
    label: 'How do you usually sleep?',
    options: [
      'Light sleeper; I wake easily or have trouble falling asleep.',
      'I sleep reasonably well and usually feel okay with a normal amount of rest.',
      'I sleep deeply, fall asleep easily, and may find it hard to wake up.',
    ],
  },
  {
    id: 'stress_sleep', group: 'Sleep',
    label: 'When stressed, what happens to your sleep?',
    options: [
      'It becomes lighter or more interrupted.',
      'I may still sleep, but I feel mentally overheated or tense.',
      'I tend to sleep more or feel sluggish.',
    ],
  },
  {
    id: 'mind_style', group: 'Mental & emotional style',
    label: 'Which best describes how your mind works?',
    options: [
      'Curious, imaginative, and full of ideas, but sometimes scattered.',
      'Sharp, decisive, and quick to judge situations.',
      'Calm, steady, and thoughtful, but slower to change direction.',
    ],
  },
  {
    id: 'pressure_response', group: 'Mental & emotional style',
    label: 'Under pressure, what are you most likely to feel?',
    options: [
      'Anxiety, nervousness, or indecision.',
      'Irritability, frustration, or anger.',
      'Withdrawal, heaviness, or emotional attachment.',
    ],
  },
  {
    id: 'memory_style', group: 'Mental & emotional style',
    label: 'Which best describes your memory and learning style?',
    options: [
      'I learn quickly, but I may forget quickly too.',
      'I learn and decide efficiently with moderate recall.',
      'I learn more slowly, but I remember well once it sticks.',
    ],
  },
];

/** Questions of a given phase, with sections that end up empty removed. */
export function sectionsForPhase(phase: 'pre' | 'anytime'): QuestionnaireSection[] {
  return INTAKE_SECTIONS
    .map((s) => ({ ...s, questions: s.questions.filter((q) => q.phase === phase) }))
    .filter((s) => s.questions.length > 0);
}

/** Whether a question should currently be visible given the answers so far. */
export function isVisible(q: Question, answers: Record<string, unknown>): boolean {
  if (!q.showIf) return true;
  return answers[q.showIf.questionId] === q.showIf.equals;
}
