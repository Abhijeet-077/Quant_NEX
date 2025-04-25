import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Patient, User } from '../models';
import { log } from '../vite';
import { Op } from 'sequelize';

// @desc    Get all patients
// @route   GET /api/patients
// @access  Private
export const getPatients = async (req: Request, res: Response) => {
  try {
    const { search, status, page = 1, limit = 10 } = req.query;
    
    // Build query conditions
    const whereClause: any = {};
    
    // Add search condition if provided
    if (search) {
      whereClause[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
        { patientId: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    // Add status filter if provided
    if (status && ['active', 'inactive', 'deceased'].includes(status as string)) {
      whereClause.status = status;
    }
    
    // Calculate pagination
    const offset = ((page as number) - 1) * (limit as number);
    
    // Get patients with pagination
    const { count, rows: patients } = await Patient.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'fullName', 'email']
        }
      ],
      order: [['updatedAt', 'DESC']],
      limit: limit as number,
      offset
    });
    
    // Calculate total pages
    const totalPages = Math.ceil(count / (limit as number));
    
    res.status(200).json({
      patients,
      pagination: {
        total: count,
        page: page as number,
        limit: limit as number,
        totalPages
      }
    });
  } catch (error) {
    log('Get patients error:', error);
    res.status(500).json({ message: 'Server error retrieving patients' });
  }
};

// @desc    Get patient by ID
// @route   GET /api/patients/:id
// @access  Private
export const getPatientById = async (req: Request, res: Response) => {
  try {
    const patient = await Patient.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'fullName', 'email']
        }
      ]
    });
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    res.status(200).json(patient);
  } catch (error) {
    log('Get patient by ID error:', error);
    res.status(500).json({ message: 'Server error retrieving patient' });
  }
};

// @desc    Create a new patient
// @route   POST /api/patients
// @access  Private
export const createPatient = async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      dateOfBirth,
      gender,
      email,
      phone,
      address,
      emergencyContact,
      emergencyPhone,
      bloodType,
      height,
      weight,
      allergies,
      medicalHistory,
      familyHistory,
      currentMedications,
      insuranceProvider,
      insuranceNumber,
      notes
    } = req.body;
    
    // Generate a unique patient ID
    const lastPatient = await Patient.findOne({
      order: [['createdAt', 'DESC']]
    });
    
    let patientNumber = 10001;
    if (lastPatient && lastPatient.patientId) {
      const lastNumber = parseInt(lastPatient.patientId.replace(/[^0-9]/g, ''));
      patientNumber = lastNumber + 1;
    }
    
    const patientId = `P${patientNumber}`;
    
    // Create the patient
    const patient = await Patient.create({
      id: uuidv4(),
      patientId,
      firstName,
      lastName,
      dateOfBirth,
      gender,
      email,
      phone,
      address,
      emergencyContact,
      emergencyPhone,
      bloodType,
      height,
      weight,
      allergies,
      medicalHistory,
      familyHistory,
      currentMedications,
      insuranceProvider,
      insuranceNumber,
      notes,
      createdBy: req.userId
    });
    
    res.status(201).json(patient);
  } catch (error) {
    log('Create patient error:', error);
    res.status(500).json({ message: 'Server error creating patient' });
  }
};

// @desc    Update a patient
// @route   PUT /api/patients/:id
// @access  Private
export const updatePatient = async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      dateOfBirth,
      gender,
      email,
      phone,
      address,
      emergencyContact,
      emergencyPhone,
      bloodType,
      height,
      weight,
      allergies,
      medicalHistory,
      familyHistory,
      currentMedications,
      insuranceProvider,
      insuranceNumber,
      notes,
      status
    } = req.body;
    
    const patient = await Patient.findByPk(req.params.id);
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    // Update patient fields
    patient.firstName = firstName || patient.firstName;
    patient.lastName = lastName || patient.lastName;
    patient.dateOfBirth = dateOfBirth || patient.dateOfBirth;
    patient.gender = gender || patient.gender;
    patient.email = email || patient.email;
    patient.phone = phone || patient.phone;
    patient.address = address || patient.address;
    patient.emergencyContact = emergencyContact || patient.emergencyContact;
    patient.emergencyPhone = emergencyPhone || patient.emergencyPhone;
    patient.bloodType = bloodType || patient.bloodType;
    patient.height = height || patient.height;
    patient.weight = weight || patient.weight;
    patient.allergies = allergies || patient.allergies;
    patient.medicalHistory = medicalHistory || patient.medicalHistory;
    patient.familyHistory = familyHistory || patient.familyHistory;
    patient.currentMedications = currentMedications || patient.currentMedications;
    patient.insuranceProvider = insuranceProvider || patient.insuranceProvider;
    patient.insuranceNumber = insuranceNumber || patient.insuranceNumber;
    patient.notes = notes || patient.notes;
    patient.status = status || patient.status;
    
    await patient.save();
    
    res.status(200).json(patient);
  } catch (error) {
    log('Update patient error:', error);
    res.status(500).json({ message: 'Server error updating patient' });
  }
};

// @desc    Delete a patient
// @route   DELETE /api/patients/:id
// @access  Private (Admin only)
export const deletePatient = async (req: Request, res: Response) => {
  try {
    const patient = await Patient.findByPk(req.params.id);
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    await patient.destroy();
    
    res.status(200).json({ message: 'Patient deleted successfully' });
  } catch (error) {
    log('Delete patient error:', error);
    res.status(500).json({ message: 'Server error deleting patient' });
  }
};
