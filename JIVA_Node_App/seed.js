const dotenv = require('dotenv');
dotenv.config();

const { sequelize, connectDB } = require('./config/db');
const User = require('./models/User');
const Package = require('./models/Package');
const Order = require('./models/Order');

const packages = [
  // ── BASE PANEL (mandatory) ──────────────────────────────────────────────
  {
    name: 'JIVA Basic Panel',
    type: 'base',
    price: 299.00,
    testCount: 27,
    description: 'Foundational panel — included in all JIVA memberships. Required for all users.',
    tests: [
      'Complete blood count (CBC)',
      'Fasting glucose',
      'HbA1c',
      'Total cholesterol',
      'LDL cholesterol (calculated)',
      'HDL cholesterol',
      'Triglycerides',
      'hs-CRP',
      'ALT',
      'AST',
      'Alkaline phosphatase',
      'Total & fractionated bilirubin',
      'Albumin + total protein',
      'Serum creatinine',
      'BUN',
      'Urinalysis (EGO)',
      'Calcium',
      'Magnesium',
      'Potassium',
      'Sodium',
      'Chloride',
      'Phosphorus',
      'CO2',
      'TSH',
      'Uric acid',
      'Vitamin D (25-OH)',
      'Ferritin'
    ]
  },

  // ── ADD-ON PANELS ($99 each) ────────────────────────────────────────────
  {
    name: 'Advanced Cardio-Metabolic Panel',
    type: 'addon',
    price: 99.00,
    testCount: 11,
    description: 'Deep cardiovascular risk assessment beyond standard cholesterol panels.',
    tests: [
      'ApoB',
      'Lp(a)',
      'Direct LDL',
      'Small dense LDL (sdLDL)',
      'LDL particle number',
      'Direct HDL',
      'Large HDL (functional)',
      'VLDL cholesterol',
      'Homocysteine',
      'NT-proBNP',
      'TG/HDL ratio (calculated)'
    ]
  },
  {
    name: 'Complete Hormonal Panel',
    type: 'addon',
    price: 99.00,
    testCount: 15,
    description: 'Comprehensive hormonal assessment covering male and female reproductive health.',
    tests: [
      'Total testosterone',
      'Free testosterone',
      'Estradiol (E2)',
      'Progesterone',
      'FSH',
      'LH',
      'Prolactin',
      'Total PSA',
      'Free PSA',
      'SHBG',
      'DHEA-S',
      'AMH',
      'Morning cortisol',
      'Free T3 (fT3)',
      'Free T4 (fT4)'
    ]
  },
  {
    name: 'Inflammation & Immunity Panel',
    type: 'addon',
    price: 99.00,
    testCount: 10,
    description: 'Identifies chronic inflammation and immune system dysfunction.',
    tests: [
      'IL-6',
      'TNF-alpha',
      'Fibrinogen',
      'ESR',
      'ANA screen',
      'Rheumatoid factor',
      'Complement C3',
      'Complement C4',
      'Lymphocyte differential',
      'D-dimer'
    ]
  },
  {
    name: 'Nutrition & Micronutrients Panel',
    type: 'addon',
    price: 99.00,
    testCount: 13,
    description: 'Evaluates key vitamins, minerals, and micronutrient status.',
    tests: [
      'Vitamin B12',
      'Folate / B9',
      'Vitamin B6',
      'Zinc',
      'Copper',
      'Selenium',
      'Serum iron',
      'TIBC',
      'Transferrin saturation',
      'Omega-3 index (EPA+DHA)',
      'Vitamin A',
      'Vitamin E',
      'Vitamin K2'
    ]
  },
  {
    name: 'Cognitive & Neurological Panel',
    type: 'addon',
    price: 99.00,
    testCount: 9,
    description: 'Assesses biomarkers linked to brain health and cognitive performance.',
    tests: [
      'Homocysteine',
      'Active B12 (holotranscobalamin)',
      'RBC folate',
      'TSH + fT3 + fT4',
      'Morning & evening cortisol',
      'Fasting glucose + insulin',
      'Vitamin D (25-OH)',
      'ApoE genotype',
      'hs-CRP'
    ]
  },
  {
    name: 'Advanced Digestive & Hepatic Panel',
    type: 'addon',
    price: 99.00,
    testCount: 10,
    description: 'Evaluates liver function, gut health, and digestive enzyme activity.',
    tests: [
      'GGT',
      'LDH',
      'Amylase',
      'Lipase',
      'H. pylori IgG',
      'Anti-gliadin IgA',
      'Anti-transglutaminase IgA',
      'Fecal calprotectin',
      'PT/INR',
      'Direct & indirect bilirubin'
    ]
  },
  {
    name: 'Longevity & Cellular Aging Panel',
    type: 'addon',
    price: 99.00,
    testCount: 11,
    description: 'Measures biological aging markers and cellular health indicators.',
    tests: [
      'IGF-1',
      'GH (fasting)',
      'DHEA-S',
      'Morning cortisol',
      'Fasting insulin',
      '8-OHdG (oxidative DNA damage)',
      'hs-CRP',
      'Homocysteine',
      'Vitamin D (25-OH) + intact PTH',
      'Telomere length',
      'NAD+ levels'
    ]
  }
];

const importData = async () => {
  try {
    await connectDB();

    // Sync all models — creates tables if not exist, drops and recreates on force: true
    await sequelize.sync({ force: true });
    console.log('✓ Database tables synced.');

    await Package.bulkCreate(packages);
    console.log(`✓ ${packages.length} packages seeded successfully.`);
    console.log('');
    console.log('Packages seeded:');
    packages.forEach(p => {
      console.log(`  [${p.type.toUpperCase()}] ${p.name} — $${p.price} — ${p.testCount} tests`);
    });

    process.exit(0);
  } catch (error) {
    console.error('✗ Seed failed:', error.message);
    process.exit(1);
  }
};

importData();
