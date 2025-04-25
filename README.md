# DocumentMasterAI - Quantum-AI Precision Oncology Suite

A cutting-edge medical imaging and oncology platform that leverages AI and quantum computing to assist in cancer diagnosis, prognosis, and treatment planning.

## Features

- **Advanced Medical Imaging Analysis**: Upload and analyze CT, MRI, and PET scans for tumor detection and characterization
- **AI-Powered Diagnosis**: Automated cancer detection and classification using state-of-the-art deep learning models
- **Quantum-Enhanced Prognosis**: Survival prediction and treatment outcome simulation using quantum computing algorithms
- **Radiation Treatment Planning**: Optimized radiation therapy planning with beam angle and dose optimization
- **Patient Monitoring**: Track biomarkers and disease progression over time
- **Comprehensive Dashboard**: Unified view of patient data, imaging, diagnosis, and treatment plans

## Tech Stack

- **Frontend**: React, TypeScript, TailwindCSS, Shadcn UI
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Passport.js with session-based auth
- **AI/ML**: Integration with various cancer detection models
- **Visualization**: Recharts, Nivo for data visualization

## Prerequisites

- Node.js (v18+)
- PostgreSQL (v14+)
- npm or yarn

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/DocumentMasterAI.git
   cd DocumentMasterAI
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following content:
   ```
   # Database Configuration
   DATABASE_URL=postgres://postgres:postgres@localhost:5432/documentmasterai

   # Session Configuration
   SESSION_SECRET=quantum-oncology-secret-local-dev

   # API Keys (replace with actual keys if available)
   OPENAI_API_KEY=your-openai-api-key
   KAGGLE_USERNAME=your-kaggle-username
   KAGGLE_KEY=your-kaggle-key

   # Environment
   NODE_ENV=development
   PORT=5000
   ```

4. Set up the database:
   ```bash
   # Create the database
   createdb -U postgres documentmasterai

   # Run migrations and seed data
   npm run db:push
   npx tsx scripts/init-db.ts
   ```

   Alternatively, you can use the setup script:
   ```bash
   ./scripts/setup-db.sh
   ```

## Running the Application

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:5000`

3. Login with the demo credentials:
   - Username: `demo`
   - Password: `password`

## Project Structure

- `/client`: Frontend React application
  - `/src`: Source code
    - `/components`: Reusable UI components
    - `/pages`: Page components
    - `/hooks`: Custom React hooks
    - `/lib`: Utility functions and libraries
- `/server`: Backend Express application
  - `/routes`: API routes
  - `/services`: Business logic and external service integrations
- `/shared`: Code shared between frontend and backend
  - `schema.ts`: Database schema and validation
- `/uploads`: Directory for uploaded files
- `/migrations`: Database migration files

## API Endpoints

- **Authentication**
  - `POST /api/register`: Register a new user
  - `POST /api/login`: Login
  - `POST /api/logout`: Logout
  - `GET /api/user`: Get current user

- **Patients**
  - `GET /api/patients`: Get all patients
  - `GET /api/patients/:id`: Get patient by ID
  - `POST /api/patients`: Create a new patient
  - `PUT /api/patients/:id`: Update a patient

- **Scans**
  - `GET /api/patients/:patientId/scans`: Get all scans for a patient
  - `POST /api/scans`: Upload a new scan

- **Diagnosis**
  - `GET /api/patients/:patientId/diagnoses`: Get diagnoses for a patient
  - `POST /api/diagnoses`: Create a new diagnosis

- **Models**
  - `GET /api/models/benchmarks`: Get model benchmarks
  - `GET /api/models/available`: Get available models
  - `POST /api/models/predict`: Get predictions from all models
  - `POST /api/models/analyze-scan`: Analyze a scan image

## License

MIT
