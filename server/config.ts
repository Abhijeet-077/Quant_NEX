import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

// Export configuration
export const config = {
  database: {
    url: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/documentmasterai',
  },
  server: {
    port: parseInt(process.env.PORT || '5000', 10),
    env: process.env.NODE_ENV || 'development',
  },
  session: {
    secret: process.env.SESSION_SECRET || 'quantum-oncology-secret-local-dev',
  },
  api: {
    openai: process.env.OPENAI_API_KEY,
    kaggle: {
      username: process.env.KAGGLE_USERNAME,
      key: process.env.KAGGLE_KEY,
    },
  },
};
