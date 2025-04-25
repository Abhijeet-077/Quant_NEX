import { db } from '../server/db';
import { users, patients, scans, diagnoses, prognoses, radiationPlans, biomarkers, alerts } from '../shared/schema';
import { scrypt } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = 'quantum-oncology-salt'; // Fixed salt for demo purposes
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString('hex')}.${salt}`;
}

async function initializeDatabase() {
  console.log('Initializing database...');

  try {
    // Create demo user
    const demoUser = {
      username: 'demo',
      password: await hashPassword('password'),
      fullName: 'Demo Doctor',
      title: 'Oncologist',
      profileImage: 'https://ui-avatars.com/api/?name=Demo+Doctor&background=0D47A1&color=fff',
    };

    console.log('Creating demo user...');
    await db.insert(users).values(demoUser).onConflictDoNothing();

    // Create demo patients
    const demoPatients = [
      {
        patientId: 'P001',
        name: 'John Smith',
        age: 65,
        gender: 'Male',
        cancerType: 'lungCancer',
        stage: 'Stage III',
        status: 'active',
        treatmentHistory: JSON.stringify({
          previousTreatments: [
            { type: 'Surgery', date: '2023-01-15', notes: 'Partial resection' },
            { type: 'Chemotherapy', date: '2023-02-20', notes: 'Cisplatin regimen' }
          ]
        }),
      },
      {
        patientId: 'P002',
        name: 'Jane Doe',
        age: 54,
        gender: 'Female',
        cancerType: 'breastCancer',
        stage: 'Stage II',
        status: 'active',
        treatmentHistory: JSON.stringify({
          previousTreatments: [
            { type: 'Surgery', date: '2023-03-10', notes: 'Lumpectomy' }
          ]
        }),
      },
      {
        patientId: 'P003',
        name: 'Robert Johnson',
        age: 72,
        gender: 'Male',
        cancerType: 'brainTumor',
        stage: 'Stage IV',
        status: 'critical',
        treatmentHistory: JSON.stringify({
          previousTreatments: [
            { type: 'Surgery', date: '2023-01-05', notes: 'Partial resection' },
            { type: 'Radiation', date: '2023-02-15', notes: 'Gamma Knife' }
          ]
        }),
      },
    ];

    console.log('Creating demo patients...');
    for (const patient of demoPatients) {
      await db.insert(patients).values(patient).onConflictDoNothing();
    }

    // Create demo scans
    const demoScans = [
      {
        patientId: 'P001',
        scanType: 'CT',
        fileUrl: '/uploads/demo-lung-ct.jpg',
        tumorDetected: true,
        tumorLocation: JSON.stringify({ x: 120, y: 85, z: 40 }),
        tumorSize: 3.2,
        malignancyScore: 0.85,
        growthRate: 0.3,
        notes: 'Tumor located in right upper lobe',
      },
      {
        patientId: 'P002',
        scanType: 'MRI',
        fileUrl: '/uploads/demo-breast-mri.jpg',
        tumorDetected: true,
        tumorLocation: JSON.stringify({ x: 95, y: 120, z: 30 }),
        tumorSize: 2.1,
        malignancyScore: 0.72,
        growthRate: 0.2,
        notes: 'Tumor located in left breast',
      },
      {
        patientId: 'P003',
        scanType: 'MRI',
        fileUrl: '/uploads/demo-brain-mri.jpg',
        tumorDetected: true,
        tumorLocation: JSON.stringify({ x: 110, y: 90, z: 50 }),
        tumorSize: 4.5,
        malignancyScore: 0.92,
        growthRate: 0.5,
        notes: 'Glioblastoma in right temporal lobe',
      },
    ];

    console.log('Creating demo scans...');
    for (const scan of demoScans) {
      await db.insert(scans).values(scan).onConflictDoNothing();
    }

    // Create demo diagnoses
    const demoDiagnoses = [
      {
        patientId: 'P001',
        primaryDiagnosis: 'Non-small cell lung carcinoma',
        confidence: 0.89,
        details: 'Adenocarcinoma subtype, moderately differentiated',
        alternativeDiagnoses: JSON.stringify([
          { diagnosis: 'Small cell lung carcinoma', probability: 0.08 },
          { diagnosis: 'Metastatic disease', probability: 0.03 }
        ]),
      },
      {
        patientId: 'P002',
        primaryDiagnosis: 'Invasive ductal carcinoma',
        confidence: 0.92,
        details: 'ER+/PR+, HER2-',
        alternativeDiagnoses: JSON.stringify([
          { diagnosis: 'Invasive lobular carcinoma', probability: 0.05 },
          { diagnosis: 'Ductal carcinoma in situ', probability: 0.03 }
        ]),
      },
      {
        patientId: 'P003',
        primaryDiagnosis: 'Glioblastoma multiforme',
        confidence: 0.95,
        details: 'IDH-wildtype, MGMT promoter unmethylated',
        alternativeDiagnoses: JSON.stringify([
          { diagnosis: 'Anaplastic astrocytoma', probability: 0.03 },
          { diagnosis: 'Metastatic disease', probability: 0.02 }
        ]),
      },
    ];

    console.log('Creating demo diagnoses...');
    for (const diagnosis of demoDiagnoses) {
      await db.insert(diagnoses).values(diagnosis).onConflictDoNothing();
    }

    // Create demo prognoses
    const demoPrognoses = [
      {
        patientId: 'P001',
        survival1yr: 0.75,
        survival3yr: 0.45,
        survival5yr: 0.25,
        treatmentScenarios: JSON.stringify([
          {
            name: 'Standard of Care',
            survival1yr: 0.75,
            survival3yr: 0.45,
            survival5yr: 0.25,
            description: 'Chemotherapy + Radiation'
          },
          {
            name: 'Experimental Immunotherapy',
            survival1yr: 0.82,
            survival3yr: 0.55,
            survival5yr: 0.35,
            description: 'Pembrolizumab + Standard of Care'
          }
        ]),
      },
      {
        patientId: 'P002',
        survival1yr: 0.95,
        survival3yr: 0.85,
        survival5yr: 0.75,
        treatmentScenarios: JSON.stringify([
          {
            name: 'Standard of Care',
            survival1yr: 0.95,
            survival3yr: 0.85,
            survival5yr: 0.75,
            description: 'Surgery + Hormone Therapy'
          },
          {
            name: 'Aggressive Approach',
            survival1yr: 0.96,
            survival3yr: 0.88,
            survival5yr: 0.80,
            description: 'Surgery + Chemotherapy + Radiation + Hormone Therapy'
          }
        ]),
      },
      {
        patientId: 'P003',
        survival1yr: 0.45,
        survival3yr: 0.15,
        survival5yr: 0.05,
        treatmentScenarios: JSON.stringify([
          {
            name: 'Standard of Care',
            survival1yr: 0.45,
            survival3yr: 0.15,
            survival5yr: 0.05,
            description: 'Surgery + Radiation + Temozolomide'
          },
          {
            name: 'Clinical Trial',
            survival1yr: 0.55,
            survival3yr: 0.25,
            survival5yr: 0.10,
            description: 'Novel targeted therapy + Standard of Care'
          }
        ]),
      },
    ];

    console.log('Creating demo prognoses...');
    for (const prognosis of demoPrognoses) {
      await db.insert(prognoses).values(prognosis).onConflictDoNothing();
    }

    // Create demo radiation plans
    const demoRadiationPlans = [
      {
        patientId: 'P001',
        beamAngles: 7,
        totalDose: 60.0,
        fractions: 30,
        tumorCoverage: 0.95,
        healthyTissueSpared: 0.85,
        organsAtRisk: JSON.stringify(['Heart', 'Spinal Cord', 'Esophagus']),
        optimizationMethod: 'VMAT',
      },
      {
        patientId: 'P002',
        beamAngles: 5,
        totalDose: 50.0,
        fractions: 25,
        tumorCoverage: 0.98,
        healthyTissueSpared: 0.90,
        organsAtRisk: JSON.stringify(['Heart', 'Lungs']),
        optimizationMethod: 'IMRT',
      },
      {
        patientId: 'P003',
        beamAngles: 9,
        totalDose: 60.0,
        fractions: 30,
        tumorCoverage: 0.92,
        healthyTissueSpared: 0.80,
        organsAtRisk: JSON.stringify(['Brainstem', 'Optic Chiasm', 'Optic Nerves']),
        optimizationMethod: 'SRS',
      },
    ];

    console.log('Creating demo radiation plans...');
    for (const plan of demoRadiationPlans) {
      await db.insert(radiationPlans).values(plan).onConflictDoNothing();
    }

    // Create demo biomarkers
    const demoBiomarkers = [
      {
        patientId: 'P001',
        type: 'CEA',
        value: 15.2,
        unit: 'ng/mL',
        normalRangeLow: 0.0,
        normalRangeHigh: 5.0,
        trend: 'up',
      },
      {
        patientId: 'P002',
        type: 'CA 15-3',
        value: 28.5,
        unit: 'U/mL',
        normalRangeLow: 0.0,
        normalRangeHigh: 30.0,
        trend: 'stable',
      },
      {
        patientId: 'P003',
        type: 'NSE',
        value: 35.8,
        unit: 'ng/mL',
        normalRangeLow: 0.0,
        normalRangeHigh: 16.3,
        trend: 'up',
      },
    ];

    console.log('Creating demo biomarkers...');
    for (const biomarker of demoBiomarkers) {
      await db.insert(biomarkers).values(biomarker).onConflictDoNothing();
    }

    // Create demo alerts
    const demoAlerts = [
      {
        patientId: 'P001',
        type: 'warning',
        message: 'CEA levels elevated',
        details: 'CEA levels have increased by 25% since last measurement',
        acknowledged: false,
      },
      {
        patientId: 'P002',
        type: 'info',
        message: 'Follow-up appointment scheduled',
        details: 'Next follow-up appointment scheduled for next week',
        acknowledged: true,
      },
      {
        patientId: 'P003',
        type: 'critical',
        message: 'Tumor growth detected',
        details: 'Latest MRI shows 15% increase in tumor size',
        acknowledged: false,
      },
    ];

    console.log('Creating demo alerts...');
    for (const alert of demoAlerts) {
      await db.insert(alerts).values(alert).onConflictDoNothing();
    }

    console.log('Database initialization complete!');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Run the initialization
initializeDatabase()
  .then(() => {
    console.log('Database setup completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Database setup failed:', error);
    process.exit(1);
  });
