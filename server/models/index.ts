import { sequelize } from '../config/database';
import User from './User';
import Patient from './Patient';

// Define associations
// User associations
User.hasMany(Patient, { foreignKey: 'createdBy', as: 'patients' });

// Patient associations
Patient.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

// Export models
export {
  sequelize,
  User,
  Patient
};
