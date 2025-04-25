const { sequelize } = require('../models');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

// Initialize database
const initDb = async () => {
  try {
    // Sync all models with database
    await sequelize.sync({ force: true });
    console.log('Database synchronized successfully.');

    // Create admin user
    const adminUser = await sequelize.models.User.create({
      id: uuidv4(),
      email: 'admin@quantnex.com',
      password: await bcrypt.hash('admin123', 10),
      fullName: 'Admin User',
      title: 'System Administrator',
      role: 'admin',
      isEmailVerified: true
    });
    console.log('Admin user created:', adminUser.email);

    // Create sample doctor user
    const doctorUser = await sequelize.models.User.create({
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
    console.log('Doctor user created:', doctorUser.email);

    // Create sample researcher user
    const researcherUser = await sequelize.models.User.create({
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
    console.log('Researcher user created:', researcherUser.email);

    // Create sample subscription
    const subscription = await sequelize.models.Subscription.create({
      userId: doctorUser.id,
      planType: 'professional',
      billingCycle: 'quarterly',
      amount: 79.00,
      currency: 'USD',
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)),
      status: 'active',
      autoRenew: true,
      features: {
        patientLimit: 'unlimited',
        quantumAnalysis: true,
        advancedReporting: true,
        prioritySupport: true
      },
      usageLimit: 1000,
      currentUsage: 0
    });
    console.log('Sample subscription created for:', doctorUser.email);

    // Create sample patients
    const patientIds = [];
    for (let i = 1; i <= 5; i++) {
      const patientId = uuidv4();
      patientIds.push(patientId);
      
      await sequelize.models.Patient.create({
        id: patientId,
        patientId: `P${10000 + i}`,
        firstName: `Patient${i}`,
        lastName: `Sample${i}`,
        dateOfBirth: new Date(1960 + i, 0, 1),
        gender: i % 2 === 0 ? 'female' : 'male',
        email: `patient${i}@example.com`,
        phone: `555-000-${1000 + i}`,
        address: `${100 + i} Main Street, Anytown, USA`,
        bloodType: ['A+', 'B+', 'O+', 'AB+'][i % 4],
        height: 170 + (i % 20),
        weight: 70 + (i % 30),
        allergies: i % 3 === 0 ? 'Penicillin' : null,
        medicalHistory: 'Hypertension, Diabetes Type 2',
        createdBy: doctorUser.id
      });
    }
    console.log(`Created ${patientIds.length} sample patients.`);

    // Create sample diagnoses
    const diagnosisTypes = [
      { type: 'Breast Cancer', subtype: 'Invasive Ductal Carcinoma', site: 'Left Breast' },
      { type: 'Lung Cancer', subtype: 'Non-Small Cell', site: 'Right Lung' },
      { type: 'Colorectal Cancer', subtype: 'Adenocarcinoma', site: 'Sigmoid Colon' },
      { type: 'Prostate Cancer', subtype: 'Adenocarcinoma', site: 'Prostate' },
      { type: 'Melanoma', subtype: 'Nodular Melanoma', site: 'Back' }
    ];

    const diagnosisIds = [];
    for (let i = 0; i < patientIds.length; i++) {
      const diagnosisId = uuidv4();
      diagnosisIds.push(diagnosisId);
      
      await sequelize.models.Diagnosis.create({
        id: diagnosisId,
        patientId: patientIds[i],
        userId: doctorUser.id,
        diagnosisDate: new Date(new Date().setMonth(new Date().getMonth() - (i % 6))),
        cancerType: diagnosisTypes[i].type,
        cancerSubtype: diagnosisTypes[i].subtype,
        stage: `Stage ${(i % 4) + 1}`,
        grade: `Grade ${(i % 3) + 1}`,
        primarySite: diagnosisTypes[i].site,
        tumorSize: 2.5 + (i % 3),
        lymphNodeInvolvement: i % 2 === 0,
        diagnosisMethod: 'biopsy',
        diagnosisNotes: 'Initial diagnosis based on biopsy and imaging.',
        aiAssisted: true,
        confidenceScore: 0.85 + (i % 15) / 100,
        quantumAnalysisPerformed: true,
        quantumAnalysisResults: {
          predictedSurvival: '85%',
          recommendedTreatments: ['Surgery', 'Chemotherapy'],
          biomarkerSignificance: 'High'
        }
      });
    }
    console.log(`Created ${diagnosisIds.length} sample diagnoses.`);

    // Create sample imaging records
    const imagingTypes = ['CT', 'MRI', 'PET', 'X-ray', 'Ultrasound'];
    const bodyParts = ['Chest', 'Abdomen', 'Pelvis', 'Brain', 'Whole Body'];

    for (let i = 0; i < patientIds.length; i++) {
      await sequelize.models.Imaging.create({
        patientId: patientIds[i],
        userId: doctorUser.id,
        imagingType: imagingTypes[i % imagingTypes.length],
        imagingDate: new Date(new Date().setDate(new Date().getDate() - (i * 5))),
        bodyPart: bodyParts[i % bodyParts.length],
        contrastUsed: i % 2 === 0,
        fileUrl: `https://storage.quantnex.com/images/patient${i}/scan${i}.dcm`,
        fileType: 'DICOM',
        fileSize: 15000000 + (i * 1000000),
        radiologistNotes: 'Detailed examination of the affected area.',
        aiAnalysisResults: {
          detectedAbnormalities: i % 2 === 0 ? ['Mass', 'Nodule'] : ['Infiltration'],
          segmentationMap: { x: 120 + i, y: 150 + i, width: 30, height: 25 }
        },
        aiConfidenceScore: 0.92 - (i % 10) / 100,
        tumorDetected: true,
        tumorLocation: { x: 125 + i, y: 155 + i, z: 45 + i },
        tumorSize: 2.8 + (i % 5) / 10,
        quantumEnhanced: true
      });
    }
    console.log(`Created ${patientIds.length} sample imaging records.`);

    // Create sample treatments
    const treatmentTypes = ['surgery', 'chemotherapy', 'radiation', 'immunotherapy', 'targeted'];
    const treatmentNames = [
      'Lumpectomy',
      'Cisplatin + Paclitaxel',
      'External Beam Radiation',
      'Pembrolizumab',
      'Erlotinib'
    ];

    for (let i = 0; i < diagnosisIds.length; i++) {
      await sequelize.models.Treatment.create({
        patientId: patientIds[i],
        diagnosisId: diagnosisIds[i],
        userId: doctorUser.id,
        treatmentType: treatmentTypes[i % treatmentTypes.length],
        treatmentName: treatmentNames[i % treatmentNames.length],
        startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
        endDate: i % 2 === 0 ? new Date(new Date().setDate(new Date().getDate() + 60)) : null,
        status: i % 2 === 0 ? 'in progress' : 'planned',
        dosage: i % treatmentTypes.length === 1 ? '75mg/m²' : null,
        frequency: i % treatmentTypes.length === 1 ? 'Every 3 weeks' : null,
        location: 'Quantum Medical Center',
        treatmentNotes: 'Patient tolerating treatment well.',
        aiRecommended: true,
        aiConfidenceScore: 0.88 + (i % 12) / 100,
        quantumOptimized: true,
        optimizationParameters: {
          targetCoverage: '98%',
          healthyTissueSparing: 'Maximum',
          doseDistribution: 'Optimal'
        }
      });
    }
    console.log(`Created ${diagnosisIds.length} sample treatments.`);

    // Create sample monitoring records
    const monitoringTypes = ['blood test', 'imaging', 'physical exam', 'biomarker', 'other'];
    const trends = ['improving', 'stable', 'worsening', 'unknown'];

    for (let i = 0; i < patientIds.length; i++) {
      await sequelize.models.Monitoring.create({
        patientId: patientIds[i],
        userId: doctorUser.id,
        monitoringDate: new Date(new Date().setDate(new Date().getDate() - (i * 7))),
        monitoringType: monitoringTypes[i % monitoringTypes.length],
        results: {
          whiteBloodCellCount: 5.5 + (i % 10) / 10,
          redBloodCellCount: 4.2 + (i % 8) / 10,
          plateletCount: 250 + (i * 10),
          tumorMarkers: {
            CEA: 3.5 + i,
            CA19_9: 25 + (i * 5)
          }
        },
        normalRanges: {
          whiteBloodCellCount: [4.5, 11.0],
          redBloodCellCount: [4.0, 5.5],
          plateletCount: [150, 450],
          tumorMarkers: {
            CEA: [0, 5],
            CA19_9: [0, 37]
          }
        },
        interpretation: 'Values within normal range, indicating good response to treatment.',
        trend: trends[i % trends.length],
        nextMonitoringDate: new Date(new Date().setDate(new Date().getDate() + 30)),
        treatmentResponseAssessment: i % 4 === 0 ? 'partial response' : 'stable disease',
        performanceStatus: i % 5,
        aiAnalysisPerformed: true,
        aiPredictions: {
          projectedResponse: 'Continued improvement expected',
          survivalProbability: 0.85 + (i % 15) / 100,
          recurrenceRisk: 'Low'
        }
      });
    }
    console.log(`Created ${patientIds.length} sample monitoring records.`);

    console.log('Database initialization completed successfully.');
  } catch (error) {
    console.error('Database initialization failed:', error);
  }
};

// Run the initialization
initDb();

module.exports = initDb;
