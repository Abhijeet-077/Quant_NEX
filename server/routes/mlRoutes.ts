import express from 'express';
import {
  detectTumor,
  classifyCancer,
  predictSurvival,
  optimizeTreatment
} from '../controllers/mlController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// All routes are protected
router.use(authenticate);

// ML API routes
router.post('/detect-tumor', detectTumor);
router.post('/classify-cancer', classifyCancer);
router.post('/predict-survival', predictSurvival);
router.post('/optimize-treatment', optimizeTreatment);

export default router;
