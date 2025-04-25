const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Monitoring = sequelize.define('Monitoring', {
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
    comment: 'Doctor who recorded the monitoring data'
  },
  monitoringDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  monitoringType: {
    type: DataTypes.ENUM('blood test', 'imaging', 'physical exam', 'biomarker', 'other'),
    allowNull: false
  },
  results: {
    type: DataTypes.JSONB,
    allowNull: false,
    comment: 'Test results in JSON format'
  },
  normalRanges: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'Normal ranges for the tests'
  },
  interpretation: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Doctor\'s interpretation of results'
  },
  trend: {
    type: DataTypes.ENUM('improving', 'stable', 'worsening', 'unknown'),
    defaultValue: 'unknown'
  },
  nextMonitoringDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  recommendedActions: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  tumorMarkers: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'Specific tumor marker values'
  },
  imagingReferenceId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Imagings',
      key: 'id'
    }
  },
  treatmentResponseAssessment: {
    type: DataTypes.ENUM('complete response', 'partial response', 'stable disease', 'progressive disease', 'not assessed'),
    allowNull: true
  },
  sideEffectsAssessment: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  performanceStatus: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0,
      max: 5
    },
    comment: 'ECOG performance status (0-5)'
  },
  qualityOfLifeScore: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Quality of life assessment score'
  },
  aiAnalysisPerformed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  aiPredictions: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  quantumAnalysisResults: {
    type: DataTypes.JSONB,
    allowNull: true
  }
}, {
  timestamps: true
});

module.exports = Monitoring;
