require('dotenv').config();
const { sequelize } = require('./config/db');
const User = require('./models/User');
const Biomarker = require('./models/Biomarker');
const Category = require('./models/Category');
const ReferenceRange = require('./models/ReferenceRange');
const TestResult = require('./models/TestResult');
const xlsx = require('xlsx');
const path = require('path');

async function seedFromExcel() {
  try {
    // 1. Sync database (we can sync to ensure tables exist, but without force: true so we don't wipe users)
    await sequelize.sync();
    console.log('✓ Database synced successfully.');

    // 2. Parse Excel file
    const filePath = 'C:\\Users\\AsvanthikaM\\Downloads\\JIVA Laboratory Packages Quotation.xlsx';
    console.log(`Parsing Excel file: ${filePath}`);
    const workbook = xlsx.readFile(filePath);

    // Filter sheets (exclude summary sheets)
    const sheetNames = workbook.SheetNames.filter(name => !name.toLowerCase().includes('summary'));

    const parsedBiomarkers = [];
    const uniqueCategoryNames = new Set();

    sheetNames.forEach(sheetName => {
      const sheet = workbook.Sheets[sheetName];
      const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });
      
      // Find table header row
      let headerIdx = -1;
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i] || [];
        if (row.includes('Test Name') || row.includes('Functional Category')) {
          headerIdx = i;
          break;
        }
      }
      
      if (headerIdx === -1) return;
      
      const testNameIdx = rows[headerIdx].indexOf('Test Name');
      const catIdx = rows[headerIdx].indexOf('Functional Category');
      
      // Extract biomarkers
      for (let i = headerIdx + 1; i < rows.length; i++) {
        const row = rows[i] || [];
        const sNo = row[1]; // Serial number is in index 1
        if (typeof sNo !== 'number') continue; // Only process rows with a numeric serial number
        
        const testName = row[testNameIdx];
        const categoryRaw = row[catIdx];
        
        if (!testName) continue;
        
        // Parse & split categories
        const categories = [];
        if (categoryRaw) {
          const rawSplit = categoryRaw.split(/[\/,+]+/);
          rawSplit.forEach(cat => {
            const trimmed = cat.trim();
            if (trimmed && trimmed !== '—' && trimmed !== '-') {
              categories.push(trimmed);
              uniqueCategoryNames.add(trimmed);
            }
          });
        }
        
        parsedBiomarkers.push({
          name: testName.trim(),
          categories
        });
      }
    });

    console.log(`✓ Parsed ${parsedBiomarkers.length} biomarkers and ${uniqueCategoryNames.size} unique categories.`);

    // 3. Insert unique Categories into Database
    console.log('Seeding Categories...');
    const categoryInstances = {};
    for (const catName of uniqueCategoryNames) {
      const [catInst] = await Category.findOrCreate({
        where: { name: catName }
      });
      categoryInstances[catName] = catInst;
    }
    console.log(`✓ seeded/found ${Object.keys(categoryInstances).length} categories in DB.`);

    // 4. Insert Biomarkers and associate them
    console.log('Seeding Biomarkers & Associations...');
    let biomarkerCount = 0;
    let associationCount = 0;

    for (const bio of parsedBiomarkers) {
      // Find or create the biomarker
      const [bioInst] = await Biomarker.findOrCreate({
        where: { name: bio.name },
        defaults: { description: `Biomarker for ${bio.name}` }
      });
      biomarkerCount++;

      // Create Many-to-Many associations
      for (const catName of bio.categories) {
        const catInst = categoryInstances[catName];
        if (catInst) {
          // Check if association already exists
          const hasCat = await bioInst.hasCategory(catInst);
          if (!hasCat) {
            await bioInst.addCategory(catInst);
            associationCount++;
          }
        }
      }
    }
    console.log(`✓ Seeded ${biomarkerCount} biomarkers and established ${associationCount} categories associations.`);

    // 5. Seed reference ranges and mock test results for the first user
    let user = await User.findOne();
    if (!user) {
      console.log('No user found. Creating default test user: test@jiva.com / password123');
      const bcrypt = require('bcryptjs');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);
      user = await User.create({
        name: 'Test User',
        email: 'test@jiva.com',
        password: hashedPassword
      });
    }

    if (user) {
      console.log(`Found/Created user: ${user.email}. Creating mock test results...`);

      // We will seed test results for a few key biomarkers to show on their dashboard
      const mockResultsData = [
        { name: 'Complete Blood Count (CBC)', value: 14.5, min: 12.0, max: 16.0, unit: 'g/dL', isNormal: true },
        { name: 'Fasting Glucose', value: 95.0, min: 70.0, max: 100.0, unit: 'mg/dL', isNormal: true },
        { name: 'Glycated Hemoglobin (HbA1c)', value: 5.4, min: 4.0, max: 5.6, unit: '%', isNormal: true },
        { name: 'Total Cholesterol', value: 245.0, min: 100.0, max: 200.0, unit: 'mg/dL', isNormal: false }, // High
        { name: 'ALT (Alanine Aminotransferase)', value: 35.0, min: 7.0, max: 56.0, unit: 'U/L', isNormal: true },
        { name: 'Serum Creatinine', value: 1.5, min: 0.6, max: 1.2, unit: 'mg/dL', isNormal: false }, // High
      ];

      for (const mock of mockResultsData) {
        // Find biomarker
        const bioInst = await Biomarker.findOne({
          where: { name: mock.name }
        });

        if (bioInst) {
          // Create Reference Range if not exists
          await ReferenceRange.findOrCreate({
            where: { biomarkerId: bioInst.id },
            defaults: {
              minRange: mock.min,
              maxRange: mock.max,
              unit: mock.unit,
              condition: 'general'
            }
          });

          // Create Test Result
          await TestResult.create({
            userId: user.id,
            biomarkerId: bioInst.id,
            value: mock.value,
            isNormal: mock.isNormal
          });
        }
      }
      console.log('✓ Mock test results seeded successfully.');
    } else {
      console.log('No user found in the database to attach mock results to. Please register/login in the app first.');
    }

    console.log('\n========================================');
    console.log('Seeding completed successfully!');
    console.log('========================================');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seedFromExcel();
