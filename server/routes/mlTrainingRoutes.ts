import express from 'express';
import {
  trainTumorDetectionModel,
  trainCancerClassificationModel,
  trainSurvivalPredictionModel,
  getTrainingJobStatus,
  getTrainedModels,
  getModelById
} from '../controllers/mlTrainingController';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

// All routes are protected
router.use(authenticate);

// Routes accessible by researchers and admins
router.use(authorize('researcher', 'admin'));

// Training routes
router.post('/tumor-detection', trainTumorDetectionModel);
router.post('/cancer-classification', trainCancerClassificationModel);
router.post('/survival-prediction', trainSurvivalPredictionModel);

// Job status routes
router.get('/jobs/:jobId', getTrainingJobStatus);

// Model routes
router.get('/models', getTrainedModels);
router.get('/models/:id', getModelById);

export default router;
