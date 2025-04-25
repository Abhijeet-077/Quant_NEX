import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import bcrypt from 'bcryptjs';

// User attributes interface
interface UserAttributes {
  id: string;
  email: string;
  password: string;
  fullName: string;
  title?: string;
  specialization?: string;
  institution?: string;
  role: 'admin' | 'doctor' | 'researcher';
  isEmailVerified: boolean;
  lastLogin?: Date;
  profileImage?: string;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface for User creation attributes
interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'isEmailVerified' | 'twoFactorEnabled'> {}

// User model class
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public email!: string;
  public password!: string;
  public fullName!: string;
  public title?: string;
  public specialization?: string;
  public institution?: string;
  public role!: 'admin' | 'doctor' | 'researcher';
  public isEmailVerified!: boolean;
  public lastLogin?: Date;
  public profileImage?: string;
  public twoFactorEnabled!: boolean;
  public twoFactorSecret?: string;
  public resetPasswordToken?: string;
  public resetPasswordExpires?: Date;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Method to check password
  public async isValidPassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
}

// Initialize User model
User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true
    },
    specialization: {
      type: DataTypes.STRING,
      allowNull: true
    },
    institution: {
      type: DataTypes.STRING,
      allowNull: true
    },
    role: {
      type: DataTypes.ENUM('admin', 'doctor', 'researcher'),
      defaultValue: 'doctor'
    },
    isEmailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    lastLogin: {
      type: DataTypes.DATE
    },
    profileImage: {
      type: DataTypes.STRING,
      allowNull: true
    },
    twoFactorEnabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    twoFactorSecret: {
      type: DataTypes.STRING,
      allowNull: true
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    resetPasswordExpires: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    hooks: {
      beforeCreate: async (user: User) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user: User) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      }
    }
  }
);

export default User;
