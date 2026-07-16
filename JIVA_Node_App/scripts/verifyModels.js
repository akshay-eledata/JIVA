/**
 * Phase 1 verification: load the central model registry, print each model's
 * associations, then run a non-destructive sequelize.sync() and list the tables
 * that exist afterward. Run: `node scripts/verifyModels.js`
 */
require('dotenv').config();

const db = require('../models');

(async () => {
  const modelNames = Object.keys(db).filter((k) => k !== 'sequelize');
  console.log(`\nModels registered (${modelNames.length}):`);
  for (const name of modelNames) {
    const assocs = Object.values(db[name].associations || {}).map(
      (a) => `${a.associationType}→${a.target.name}`
    );
    console.log(`  • ${name}${assocs.length ? '  [' + assocs.join(', ') + ']' : ''}`);
  }

  try {
    await db.sequelize.authenticate();
    console.log('\n✅ DB authenticated.');
    await db.sequelize.sync(); // non-destructive: creates missing tables only
    console.log('✅ sequelize.sync() completed (no errors).');
    const tables = await db.sequelize.getQueryInterface().showAllTables();
    console.log(`\nTables now in DB (${tables.length}):\n  ${tables.sort().join('\n  ')}`);
    process.exit(0);
  } catch (err) {
    console.error('\n⚠️  DB step failed (model definitions still loaded OK):');
    console.error('   ' + err.message);
    process.exit(1);
  }
})();
