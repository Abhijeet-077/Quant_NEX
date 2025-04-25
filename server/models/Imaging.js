const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Imaging = sequelize.define('Imaging', {
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
    comment: 'Doctor who ordered the imaging'
  },
  imagingType: {
    type: DataTypes.ENUM('CT', 'MRI', 'PET', 'X-ray', 'Ultrasound', 'Mammogram', 'Other'),
    allowNull: false
  },
  imagingDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  bodyPart: {
    type: DataTypes.STRING,
    allowNull: false
  },
  contrastUsed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  fileUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  filePath: {
    type: DataTypes.STRING,
    allowNull: true
  },
  fileType: {
    type: DataTypes.STRING,
    allowNull: true
  },
  fileSize: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Size in bytes'
  },
  dicomMetadata: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  radiologistNotes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  aiAnalysisResults: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  aiConfidenceScore: {
    type: DataTypes.FLOAT,
    allowNull: true,
    validate: {
      min: 0,
      max: 1
    }
  },
  tumorDetected: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  },
  tumorLocation: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'Coordinates or region information'
  },
  tumorSize: {
    type: DataTypes.FLOAT,
    allowNull: true,
    comment: 'Size in cm'
  },
  quantumEnhanced: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  quantumEnhancementDetails: {
    type: DataTypes.JSONB,
    allowNull: true
  }
}, {
  timestamps: true
});

module.exports = Imaging;
