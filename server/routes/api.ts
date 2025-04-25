import express from 'express';
import authRoutes from './authRoutes';
import patientRoutes from './patientRoutes';
import mlRoutes from './mlRoutes';
import quantumRoutes from './quantumRoutes';
import dataRoutes from './dataRoutes';
import mlTrainingRoutes from './mlTrainingRoutes';

const router = express.Router();

// API routes
router.use('/auth', authRoutes);
router.use('/patients', patientRoutes);
router.use('/ml', mlRoutes);
router.use('/quantum', quantumRoutes);
router.use('/data', dataRoutes);
router.use('/ml-training', mlTrainingRoutes);

// API health check
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'QUANT-NEX API is running' });
});

export default router;
