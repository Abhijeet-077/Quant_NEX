const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Diagnosis = sequelize.define('Diagnosis', {
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
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    },
    comment: 'Doctor who made the diagnosis'
  },
  diagnosisDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  cancerType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cancerSubtype: {
    type: DataTypes.STRING,
    allowNull: true
  },
  stage: {
    type: DataTypes.STRING,
    allowNull: true
  },
  grade: {
    type: DataTypes.STRING,
    allowNull: true
  },
  primarySite: {
    type: DataTypes.STRING,
    allowNull: false
  },
  metastasisSites: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true
  },
  tumorSize: {
    type: DataTypes.FLOAT,
    allowNull: true,
    comment: 'Size in cm'
  },
  lymphNodeInvolvement: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  },
  biomarkers: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'JSON object containing biomarker data'
  },
  geneticMutations: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'JSON object containing genetic mutation data'
  },
  diagnosisMethod: {
    type: DataTypes.ENUM('biopsy', 'imaging', 'blood test', 'other'),
    allowNull: true
  },
  diagnosisNotes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  histopathologyReport: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  confidenceScore: {
    type: DataTypes.FLOAT,
    allowNull: true,
    validate: {
      min: 0,
      max: 1
    },
    comment: 'AI confidence score between 0 and 1'
  },
  aiAssisted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  quantumAnalysisPerformed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  quantumAnalysisResults: {
    type: DataTypes.JSONB,
    allowNull: true
  }
}, {
  timestamps: true
});

module.exports = Diagnosis;
