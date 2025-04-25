import express from 'express';
import {
  getPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient
} from '../controllers/patientController';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

// All routes are protected
router.use(authenticate);

// Routes accessible by doctors and admins
router.get('/', getPatients);
router.get('/:id', getPatientById);
router.post('/', createPatient);
router.put('/:id', updatePatient);

// Routes accessible only by admins
router.delete('/:id', authorize('admin'), deletePatient);

export default router;
