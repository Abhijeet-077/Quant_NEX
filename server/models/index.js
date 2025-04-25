const User = require('./User');
const Patient = require('./Patient');
const Diagnosis = require('./Diagnosis');
const Imaging = require('./Imaging');
const Treatment = require('./Treatment');
const Monitoring = require('./Monitoring');
const Subscription = require('./Subscription');
const { sequelize } = require('../config/database');

// Define associations
// User associations
User.hasMany(Patient, { foreignKey: 'createdBy', as: 'patients' });
User.hasMany(Diagnosis, { foreignKey: 'userId', as: 'diagnoses' });
User.hasMany(Imaging, { foreignKey: 'userId', as: 'imagings' });
User.hasMany(Treatment, { foreignKey: 'userId', as: 'treatments' });
User.hasMany(Monitoring, { foreignKey: 'userId', as: 'monitorings' });
User.hasOne(Subscription, { foreignKey: 'userId', as: 'subscription' });

// Patient associations
Patient.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
Patient.hasMany(Diagnosis, { foreignKey: 'patientId', as: 'diagnoses' });
Patient.hasMany(Imaging, { foreignKey: 'patientId', as: 'imagings' });
Patient.hasMany(Treatment, { foreignKey: 'patientId', as: 'treatments' });
Patient.hasMany(Monitoring, { foreignKey: 'patientId', as: 'monitorings' });

// Diagnosis associations
Diagnosis.belongsTo(Patient, { foreignKey: 'patientId', as: 'patient' });
Diagnosis.belongsTo(User, { foreignKey: 'userId', as: 'doctor' });
Diagnosis.hasMany(Treatment, { foreignKey: 'diagnosisId', as: 'treatments' });

// Imaging associations
Imaging.belongsTo(Patient, { foreignKey: 'patientId', as: 'patient' });
Imaging.belongsTo(User, { foreignKey: 'userId', as: 'doctor' });
Imaging.hasMany(Monitoring, { foreignKey: 'imagingReferenceId', as: 'monitoringRecords' });

// Treatment associations
Treatment.belongsTo(Patient, { foreignKey: 'patientId', as: 'patient' });
Treatment.belongsTo(Diagnosis, { foreignKey: 'diagnosisId', as: 'diagnosis' });
Treatment.belongsTo(User, { foreignKey: 'userId', as: 'doctor' });

// Monitoring associations
Monitoring.belongsTo(Patient, { foreignKey: 'patientId', as: 'patient' });
Monitoring.belongsTo(User, { foreignKey: 'userId', as: 'doctor' });
Monitoring.belongsTo(Imaging, { foreignKey: 'imagingReferenceId', as: 'imaging' });

// Subscription associations
Subscription.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Export models
module.exports = {
  sequelize,
  User,
  Patient,
  Diagnosis,
  Imaging,
  Treatment,
  Monitoring,
  Subscription
};
