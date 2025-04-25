import { sequelize, User, Patient } from '../models';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { log } from '../vite';

// Initialize database
const initDb = async (): Promise<void> => {
  try {
    // Sync all models with database
    await sequelize.sync({ force: true });
    log('Database synchronized successfully.');

    // Create admin user
    const adminUser = await User.create({
      id: uuidv4(),
      email: 'admin@quantnex.com',
      password: await bcrypt.hash('admin123', 10),
      fullName: 'Admin User',
      title: 'System Administrator',
      role: 'admin',
      isEmailVerified: true
    });
    log('Admin user created:', adminUser.email);

    // Create sample doctor user
    const doctorUser = await User.create({
      id: uuidv4(),
      email: 'doctor@quantnex.com',
      password: await bcrypt.hash('doctor123', 10),
      fullName: 'Dr. Jane Smith',
      title: 'Oncologist',
      specialization: 'Medical Oncology',
      institution: 'Quantum Medical Center',
      role: 'doctor',
      isEmailVerified: true
    });
    log('Doctor user created:', doctorUser.email);

    // Create sample researcher user
    const researcherUser = await User.create({
      id: uuidv4(),
      email: 'researcher@quantnex.com',
      password: await bcrypt.hash('researcher123', 10),
      fullName: 'Dr. Robert Johnson',
      title: 'Research Scientist',
      specialization: 'Cancer Genomics',
      institution: 'Quantum Research Institute',
      role: 'researcher',
      isEmailVerified: true
    });
    log('Researcher user created:', researcherUser.email);

    // Create sample patients
    const patientIds: string[] = [];
    for (let i = 1; i <= 5; i++) {
      const patientId = uuidv4();
      patientIds.push(patientId);
      
      await Patient.create({
        id: patientId,
        patientId: `P${10000 + i}`,
        firstName: `Patient${i}`,
        lastName: `Sample${i}`,
        dateOfBirth: new Date(1960 + i, 0, 1),
        gender: i % 2 === 0 ? 'female' : 'male',
        email: `patient${i}@example.com`,
        phone: `555-000-${1000 + i}`,
        address: `${100 + i} Main Street, Anytown, USA`,
        bloodType: ['A+', 'B+', 'O+', 'AB+', 'A-'][i % 5] as any,
        height: 170 + (i % 20),
        weight: 70 + (i % 30),
        allergies: i % 3 === 0 ? 'Penicillin' : undefined,
        medicalHistory: 'Hypertension, Diabetes Type 2',
        createdBy: doctorUser.id
      });
    }
    log(`Created ${patientIds.length} sample patients.`);

    log('Database initialization completed successfully.');
  } catch (error) {
    log('Database initialization failed:', error);
  }
};

// Export the initialization function
export default initDb;
