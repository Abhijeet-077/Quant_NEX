import express from 'express';
import {
  getAvailableDatasets,
  getDatasetInfo,
  processTumorDetectionDataset,
  processCancerClassificationDataset
} from '../controllers/dataController';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

// All routes are protected
router.use(authenticate);

// Routes accessible by doctors, researchers, and admins
router.get('/datasets', getAvailableDatasets);
router.get('/datasets/:name', getDatasetInfo);

// Routes accessible only by researchers and admins
router.post('/process/tumor-detection/:name', authorize('researcher', 'admin'), processTumorDetectionDataset);
router.post('/process/cancer-classification/:name', authorize('researcher', 'admin'), processCancerClassificationDataset);

export default router;
