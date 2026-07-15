require('dotenv').config();
const { sequelize } = require('./config/db');
const models = require('./models');

(async () => {
  const queryInterface = sequelize.getQueryInterface();
  try {
    console.log('Adding role column specifically...');
    await queryInterface.addColumn('Users', 'role', {
      type: require('sequelize').DataTypes.ENUM('user', 'admin'),
      defaultValue: 'user'
    });
    console.log('Added role column successfully!');
    process.exit(0);
  } catch (err) {
    if (err.message.includes('already exists')) {
       console.log('Role column already exists!');
       process.exit(0);
    }
    console.error('Error:', err);
    process.exit(1);
  }
})();
