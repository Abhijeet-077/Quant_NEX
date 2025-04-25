import { Request, Response } from 'express';
import { mlTrainingService } from '../services/mlTrainingService';
import { log } from '../vite';

// @desc    Train tumor detection model
// @route   POST /api/v1/ml-training/tumor-detection
// @access  Private
export const trainTumorDetectionModel = async (req: Request, res: Response) => {
  try {
    const { datasetName, options } = req.body;
    
    if (!datasetName) {
      return res.status(400).json({ message: 'Dataset name is required' });
    }
    
    // Start training in the background
    const trainingPromise = mlTrainingService.trainTumorDetectionModel(datasetName, options);
    
    // Return immediately with a job ID
    const jobId = `job-${Date.now()}`;
    
    // Store the promise in a global map (in a real app, use a job queue)
    global.trainingJobs = global.trainingJobs || new Map();
    global.trainingJobs.set(jobId, trainingPromise);
    
    // When training completes, remove the job from the map
    trainingPromise.then(() => {
      global.trainingJobs.delete(jobId);
    }).catch(() => {
      global.trainingJobs.delete(jobId);
    });
    
    res.status(202).json({
      message: 'Training started',
      jobId,
      status: 'processing'
    });
  } catch (error) {
    log('Train tumor detection model error:', error);
    res.status(500).json({ message: 'Failed to start model training' });
  }
};

// @desc    Train cancer classification model
// @route   POST /api/v1/ml-training/cancer-classification
// @access  Private
export const trainCancerClassificationModel = async (req: Request, res: Response) => {
  try {
    const { datasetName, options } = req.body;
    
    if (!datasetName) {
      return res.status(400).json({ message: 'Dataset name is required' });
    }
    
    // Start training in the background
    const trainingPromise = mlTrainingService.trainCancerClassificationModel(datasetName, options);
    
    // Return immediately with a job ID
    const jobId = `job-${Date.now()}`;
    
    // Store the promise in a global map (in a real app, use a job queue)
    global.trainingJobs = global.trainingJobs || new Map();
    global.trainingJobs.set(jobId, trainingPromise);
    
    // When training completes, remove the job from the map
    trainingPromise.then(() => {
      global.trainingJobs.delete(jobId);
    }).catch(() => {
      global.trainingJobs.delete(jobId);
    });
    
    res.status(202).json({
      message: 'Training started',
      jobId,
      status: 'processing'
    });
  } catch (error) {
    log('Train cancer classification model error:', error);
    res.status(500).json({ message: 'Failed to start model training' });
  }
};

// @desc    Train survival prediction model
// @route   POST /api/v1/ml-training/survival-prediction
// @access  Private
export const trainSurvivalPredictionModel = async (req: Request, res: Response) => {
  try {
    const { datasetName, options } = req.body;
    
    if (!datasetName) {
      return res.status(400).json({ message: 'Dataset name is required' });
    }
    
    // Start training in the background
    const trainingPromise = mlTrainingService.trainSurvivalPredictionModel(datasetName, options);
    
    // Return immediately with a job ID
    const jobId = `job-${Date.now()}`;
    
    // Store the promise in a global map (in a real app, use a job queue)
    global.trainingJobs = global.trainingJobs || new Map();
    global.trainingJobs.set(jobId, trainingPromise);
    
    // When training completes, remove the job from the map
    trainingPromise.then(() => {
      global.trainingJobs.delete(jobId);
    }).catch(() => {
      global.trainingJobs.delete(jobId);
    });
    
    res.status(202).json({
      message: 'Training started',
      jobId,
      status: 'processing'
    });
  } catch (error) {
    log('Train survival prediction model error:', error);
    res.status(500).json({ message: 'Failed to start model training' });
  }
};

// @desc    Get training job status
// @route   GET /api/v1/ml-training/jobs/:jobId
// @access  Private
export const getTrainingJobStatus = async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;
    
    // Check if the job exists
    global.trainingJobs = global.trainingJobs || new Map();
    
    if (!global.trainingJobs.has(jobId)) {
      return res.status(404).json({ message: 'Training job not found' });
    }
    
    res.status(200).json({
      jobId,
      status: 'processing'
    });
  } catch (error) {
    log('Get training job status error:', error);
    res.status(500).json({ message: 'Failed to get training job status' });
  }
};

// @desc    Get all trained models
// @route   GET /api/v1/ml-training/models
// @access  Private
export const getTrainedModels = async (req: Request, res: Response) => {
  try {
    const models = mlTrainingService.getTrainedModels();
    res.status(200).json(models);
  } catch (error) {
    log('Get trained models error:', error);
    res.status(500).json({ message: 'Failed to get trained models' });
  }
};

// @desc    Get model by ID
// @route   GET /api/v1/ml-training/models/:id
// @access  Private
export const getModelById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const model = mlTrainingService.getModelById(id);
    
    if (!model) {
      return res.status(404).json({ message: 'Model not found' });
    }
    
    res.status(200).json(model);
  } catch (error) {
    log('Get model by ID error:', error);
    res.status(500).json({ message: 'Failed to get model' });
  }
};
