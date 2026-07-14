/**
 * Central model registry + associations.
 *
 * Requiring this module guarantees every model is defined on the shared
 * Sequelize instance and that all associations are wired exactly once. Always
 * import models from here (e.g. `const { User, LabReport } = require('../models')`)
 * rather than from individual files.
 */

const { sequelize } = require('../config/db');

// Reference / catalog models
const FunctionalSystem = require('./FunctionalSystem');
const Panel = require('./Panel');
const Biomarker = require('./Biomarker');
const PanelBiomarker = require('./PanelBiomarker');
const ReferenceRange = require('./ReferenceRange');

// User + commerce
const User = require('./User');
const Order = require('./Order');
const Subscription = require('./Subscription');

// Patient data
const PatientProfile = require('./PatientProfile');
const Questionnaire = require('./Questionnaire');
const LabReport = require('./LabReport');
const TestResult = require('./TestResult');

// Engine output
const Diagnosis = require('./Diagnosis');
const FoodRecommendation = require('./FoodRecommendation');
const ExerciseRecommendation = require('./ExerciseRecommendation');
const SupplementRecommendation = require('./SupplementRecommendation');
const SystemSummary = require('./SystemSummary');

/* ────────────────────────────── Associations ───────────────────────────── */

// Biomarker → FunctionalSystem (single primary system, D3)
FunctionalSystem.hasMany(Biomarker, { foreignKey: 'functionalSystemId' });
Biomarker.belongsTo(FunctionalSystem, { foreignKey: 'functionalSystemId' });

// Panel ↔ Biomarker (many-to-many via PanelBiomarker)
Panel.belongsToMany(Biomarker, { through: PanelBiomarker, foreignKey: 'panelId', otherKey: 'biomarkerId', onDelete: 'CASCADE' });
Biomarker.belongsToMany(Panel, { through: PanelBiomarker, foreignKey: 'biomarkerId', otherKey: 'panelId', onDelete: 'CASCADE' });

// Biomarker → ReferenceRange
Biomarker.hasMany(ReferenceRange, { foreignKey: 'biomarkerId', onDelete: 'CASCADE' });
ReferenceRange.belongsTo(Biomarker, { foreignKey: 'biomarkerId' });

// User → Order
User.hasMany(Order, { foreignKey: 'userId', onDelete: 'CASCADE' });
Order.belongsTo(User, { foreignKey: 'userId' });

// User / Panel → Subscription
User.hasMany(Subscription, { foreignKey: 'userId', onDelete: 'CASCADE' });
Subscription.belongsTo(User, { foreignKey: 'userId' });
Panel.hasMany(Subscription, { foreignKey: 'panelId' });
Subscription.belongsTo(Panel, { foreignKey: 'panelId' });

// User → PatientProfile (one-to-one)
User.hasOne(PatientProfile, { foreignKey: 'userId', onDelete: 'CASCADE' });
PatientProfile.belongsTo(User, { foreignKey: 'userId' });

// User / PatientProfile → Questionnaire
User.hasMany(Questionnaire, { foreignKey: 'userId', onDelete: 'CASCADE' });
Questionnaire.belongsTo(User, { foreignKey: 'userId' });
PatientProfile.hasMany(Questionnaire, { foreignKey: 'patientProfileId' });
Questionnaire.belongsTo(PatientProfile, { foreignKey: 'patientProfileId' });

// User → LabReport
User.hasMany(LabReport, { foreignKey: 'userId', onDelete: 'CASCADE' });
LabReport.belongsTo(User, { foreignKey: 'userId' });

// LabReport / User / Biomarker / FunctionalSystem → TestResult
LabReport.hasMany(TestResult, { foreignKey: 'labReportId', onDelete: 'CASCADE' });
TestResult.belongsTo(LabReport, { foreignKey: 'labReportId' });
User.hasMany(TestResult, { foreignKey: 'userId', onDelete: 'CASCADE' });
TestResult.belongsTo(User, { foreignKey: 'userId' });
Biomarker.hasMany(TestResult, { foreignKey: 'biomarkerId' });
TestResult.belongsTo(Biomarker, { foreignKey: 'biomarkerId' });
FunctionalSystem.hasMany(TestResult, { foreignKey: 'functionalSystemId' });
TestResult.belongsTo(FunctionalSystem, { foreignKey: 'functionalSystemId' });

// LabReport → engine output children
LabReport.hasMany(Diagnosis, { foreignKey: 'labReportId', onDelete: 'CASCADE' });
Diagnosis.belongsTo(LabReport, { foreignKey: 'labReportId' });

LabReport.hasMany(FoodRecommendation, { foreignKey: 'labReportId', onDelete: 'CASCADE' });
FoodRecommendation.belongsTo(LabReport, { foreignKey: 'labReportId' });

LabReport.hasMany(ExerciseRecommendation, { foreignKey: 'labReportId', onDelete: 'CASCADE' });
ExerciseRecommendation.belongsTo(LabReport, { foreignKey: 'labReportId' });

LabReport.hasMany(SupplementRecommendation, { foreignKey: 'labReportId', onDelete: 'CASCADE' });
SupplementRecommendation.belongsTo(LabReport, { foreignKey: 'labReportId' });

LabReport.hasMany(SystemSummary, { foreignKey: 'labReportId', onDelete: 'CASCADE' });
SystemSummary.belongsTo(LabReport, { foreignKey: 'labReportId' });
FunctionalSystem.hasMany(SystemSummary, { foreignKey: 'functionalSystemId' });
SystemSummary.belongsTo(FunctionalSystem, { foreignKey: 'functionalSystemId' });

module.exports = {
  sequelize,
  FunctionalSystem,
  Panel,
  Biomarker,
  PanelBiomarker,
  ReferenceRange,
  User,
  Order,
  Subscription,
  PatientProfile,
  Questionnaire,
  LabReport,
  TestResult,
  Diagnosis,
  FoodRecommendation,
  ExerciseRecommendation,
  SupplementRecommendation,
  SystemSummary
};
