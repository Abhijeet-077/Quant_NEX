import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import { log } from '../vite';

dotenv.config();

// Create a Sequelize instance with PostgreSQL
let sequelize: Sequelize;

// Try to use the DATABASE_URL if available, otherwise use individual parameters
if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    dialectOptions: {
      ssl: process.env.NODE_ENV === 'production' ? {
        require: true,
        rejectUnauthorized: false
      } : false
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME || 'quantnex_db',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || 'postgres',
    {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      dialect: 'postgres',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  );
}

// Test the connection
const testConnection = async (): Promise<boolean> => {
  try {
    await sequelize.authenticate();
    log('Database connection has been established successfully.');
    return true;
  } catch (error) {
    log('Unable to connect to the database:', error);
    log('The application will continue to run without database functionality.');
    log('Please make sure PostgreSQL is installed and running, or update your .env file with correct database credentials.');
    return false;
  }
};

export { sequelize, testConnection };
