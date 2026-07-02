require('dotenv').config();
const { sequelize } = require('./config/db');
const User = require('./models/User');
const Biomarker = require('./models/Biomarker');
const Category = require('./models/Category');
const ReferenceRange = require('./models/ReferenceRange');
const TestResult = require('./models/TestResult');

async function seedMedicalData() {
  try {
    await sequelize.sync(); // Ensure tables exist

    console.log('Seeding Medical Data...');

    // 1. Create Categories
    const [autoImmunity] = await Category.findOrCreate({ where: { name: 'AutoImmunity' } });
    const [cardio] = await Category.findOrCreate({ where: { name: 'Cardio' } });
    const [metabolic] = await Category.findOrCreate({ where: { name: 'Metabolic' } });

    // 2. Create Biomarkers
    const ana = await Biomarker.create({
      name: 'Anti Nuclear Antibodies (ANA) Pattern',
      description: 'Test for autoimmune conditions'
    });

    const cholesterol = await Biomarker.create({
      name: 'Total Cholesterol',
      description: 'A measure of the total amount of cholesterol in your blood'
    });

    // 3. Associate Biomarkers with Categories (Many-to-Many helpers)
    await ana.addCategory(autoImmunity);
    await cholesterol.addCategory(cardio);
    await cholesterol.addCategory(metabolic);

    // 4. Create Reference Ranges
    await ReferenceRange.create({
      biomarkerId: ana.id,
      minRange: 0,
      maxRange: 40,
      unit: 'nmol/L'
    });

    await ReferenceRange.create({
      biomarkerId: cholesterol.id,
      minRange: 100,
      maxRange: 200,
      unit: 'mg/dL'
    });

    // 5. Find first user to attach results to
    const user = await User.findOne();
    if (user) {
      // Create a "Bad" test result for ANA
      await TestResult.create({
        userId: user.id,
        biomarkerId: ana.id,
        value: 410, // Way over the 40 max
        isNormal: false
      });

      // Create a "Good" test result for Total Cholesterol
      await TestResult.create({
        userId: user.id,
        biomarkerId: cholesterol.id,
        value: 180, // Healthy level
        isNormal: true
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
