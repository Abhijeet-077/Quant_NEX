import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

// Patient attributes interface
interface PatientAttributes {
  id: string;
  patientId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  email?: string;
  phone?: string;
  address?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  bloodType: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'Unknown';
  height?: number;
  weight?: number;
  allergies?: string;
  medicalHistory?: string;
  familyHistory?: string;
  currentMedications?: string;
  insuranceProvider?: string;
  insuranceNumber?: string;
  notes?: string;
  status: 'active' | 'inactive' | 'deceased';
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface for Patient creation attributes
interface PatientCreationAttributes extends Optional<PatientAttributes, 'id' | 'bloodType' | 'status'> {}

// Patient model class
class Patient extends Model<PatientAttributes, PatientCreationAttributes> implements PatientAttributes {
  public id!: string;
  public patientId!: string;
  public firstName!: string;
  public lastName!: string;
  public dateOfBirth!: Date;
  public gender!: 'male' | 'female' | 'other';
  public email?: string;
  public phone?: string;
  public address?: string;
  public emergencyContact?: string;
  public emergencyPhone?: string;
  public bloodType!: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'Unknown';
  public height?: number;
  public weight?: number;
  public allergies?: string;
  public medicalHistory?: string;
  public familyHistory?: string;
  public currentMedications?: string;
  public insuranceProvider?: string;
  public insuranceNumber?: string;
  public notes?: string;
  public status!: 'active' | 'inactive' | 'deceased';
  public createdBy?: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize Patient model
Patient.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    patientId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    gender: {
      type: DataTypes.ENUM('male', 'female', 'other'),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    emergencyContact: {
      type: DataTypes.STRING,
      allowNull: true
    },
    emergencyPhone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    bloodType: {
      type: DataTypes.ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'),
      defaultValue: 'Unknown'
    },
    height: {
      type: DataTypes.FLOAT,
      allowNull: true,
      comment: 'Height in cm'
    },
    weight: {
      type: DataTypes.FLOAT,
      allowNull: true,
      comment: 'Weight in kg'
    },
    allergies: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    medicalHistory: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    familyHistory: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    currentMedications: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    insuranceProvider: {
      type: DataTypes.STRING,
      allowNull: true
    },
    insuranceNumber: {
      type: DataTypes.STRING,
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'deceased'),
      defaultValue: 'active'
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  },
  {
    sequelize,
    modelName: 'Patient',
    tableName: 'patients',
    timestamps: true
  }
);

export default Patient;
