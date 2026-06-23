require('dotenv').config();
const { sequelize } = require('./config/db');
const User = require('./models/User');
const Biomarker = require('./models/Biomarker');
const ReferenceRange = require('./models/ReferenceRange');
const TestResult = require('./models/TestResult');

async function seedMedicalData() {
  try {
    await sequelize.sync({ alter: true }); // Ensure tables exist

    console.log('Seeding Medical Data...');

    // 1. Create a Biomarker
    const ana = await Biomarker.create({
      name: 'Anti Nuclear Antibodies (ANA) Pattern',
      category: 'AutoImmunity',
      description: 'Test for autoimmune conditions'
    });

    // 2. Create Reference Range for ANA
    await ReferenceRange.create({
      biomarkerId: ana.id,
      minRange: 0,
      maxRange: 40,
      unit: 'nmol/L'
    });

    // 3. Find first user to attach results to
    const user = await User.findOne();
    if (user) {
      // 4. Create a "Bad" test result for this user
      await TestResult.create({
        userId: user.id,
        biomarkerId: ana.id,
        value: 410, // Way over the 40 max
        isNormal: false
      });
      console.log('Medical data seeded successfully!');
    } else {
      console.log('No user found to attach results to. Please register a user first.');
    }

    process.exit();
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seedMedicalData();
