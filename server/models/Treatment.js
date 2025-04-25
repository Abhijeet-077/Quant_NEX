const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Treatment = sequelize.define('Treatment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  patientId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Patients',
      key: 'id'
    }
  },
  diagnosisId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Diagnoses',
      key: 'id'
    }
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    },
    comment: 'Doctor who prescribed the treatment'
  },
  treatmentType: {
    type: DataTypes.ENUM('surgery', 'chemotherapy', 'radiation', 'immunotherapy', 'targeted', 'hormone', 'stem cell', 'other'),
    allowNull: false
  },
  treatmentName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('planned', 'in progress', 'completed', 'discontinued'),
    defaultValue: 'planned'
  },
  dosage: {
    type: DataTypes.STRING,
    allowNull: true
  },
  frequency: {
    type: DataTypes.STRING,
    allowNull: true
  },
  route: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Administration route (oral, IV, etc.)'
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Hospital or clinic where treatment is administered'
  },
  sideEffects: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  treatmentNotes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  effectiveness: {
    type: DataTypes.ENUM('excellent', 'good', 'moderate', 'poor', 'unknown'),
    defaultValue: 'unknown'
  },
  discontinuationReason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  aiRecommended: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  aiConfidenceScore: {
    type: DataTypes.FLOAT,
    allowNull: true,
    validate: {
      min: 0,
      max: 1
    }
  },
  quantumOptimized: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  optimizationParameters: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  radiationDetails: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'Details specific to radiation therapy'
  },
  surgeryDetails: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'Details specific to surgical procedures'
  },
  drugDetails: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'Details specific to drug therapies'
  }
}, {
  timestamps: true
});

module.exports = Treatment;
