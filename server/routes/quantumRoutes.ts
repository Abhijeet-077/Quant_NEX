import express from 'express';
import {
  optimizeRadiationTherapy,
  analyzeGenomicData,
  predictDrugInteractions
} from '../controllers/quantumController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// All routes are protected
router.use(authenticate);

// Quantum computing API routes
router.post('/optimize-radiation', optimizeRadiationTherapy);
router.post('/analyze-genomic', analyzeGenomicData);
router.post('/predict-drug-interactions', predictDrugInteractions);

export default router;
