const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Subscription = sequelize.define('Subscription', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  planType: {
    type: DataTypes.ENUM('basic', 'professional', 'enterprise'),
    allowNull: false
  },
  billingCycle: {
    type: DataTypes.ENUM('monthly', 'quarterly', 'yearly'),
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'USD'
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('active', 'canceled', 'expired', 'trial'),
    defaultValue: 'active'
  },
  autoRenew: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  stripeCustomerId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  stripeSubscriptionId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  lastPaymentDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  nextPaymentDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  paymentMethod: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'Payment method details'
  },
  features: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'Features included in this subscription'
  },
  usageLimit: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Maximum number of patients allowed'
  },
  currentUsage: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Current number of patients'
  },
  cancellationReason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  promotionCode: {
    type: DataTypes.STRING,
    allowNull: true
  },
  discountAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  invoiceHistory: {
    type: DataTypes.JSONB,
    allowNull: true
  }
}, {
  timestamps: true
});

module.exports = Subscription;
