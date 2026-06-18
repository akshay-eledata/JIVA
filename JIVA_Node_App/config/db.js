const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false, // set to console.log to see the raw SQL queries
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(`PostgreSQL Connected: ${sequelize.config.host}`);
  } catch (error) {
    console.error(`Error connecting to PostgreSQL: ${error.message}`);
  }
};

module.exports = { sequelize, connectDB };
