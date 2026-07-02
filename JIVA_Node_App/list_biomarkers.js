require('dotenv').config();
const { sequelize } = require('./config/db');
const Biomarker = require('./models/Biomarker');

async function listBiomarkers() {
  try {
    await sequelize.sync();
    const biomarkers = await Biomarker.findAll({ attributes: ['name'] });
    console.log('Total biomarkers in DB:', biomarkers.length);
    console.log('List of biomarkers:');
    biomarkers.forEach((b, i) => {
      console.log(`${i + 1}: "${b.name}"`);
    });
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

listBiomarkers();
