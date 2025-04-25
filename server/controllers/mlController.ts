import { Request, Response } from 'express';
import { mlService } from '../services/mlService';
import { log } from '../vite';

// @desc    Detect tumor in medical image
// @route   POST /api/v1/ml/detect-tumor
// @access  Private
export const detectTumor = async (req: Request, res: Response) => {
  try {
    const { imageData } = req.body;
    
    if (!imageData) {
      return res.status(400).json({ message: 'Image data is required' });
    }
    
    const result = await mlService.detectTumor(imageData);
    res.status(200).json(result);
  } catch (error) {
    log('Tumor detection API error:', error);
    res.status(500).json({ message: 'Failed to process tumor detection' });
  }
};

// @desc    Classify cancer type
// @route   POST /api/v1/ml/classify-cancer
// @access  Private
export const classifyCancer = async (req: Request, res: Response) => {
  try {
    const patientData = req.body;
    
    if (!patientData) {
      return res.status(400).json({ message: 'Patient data is required' });
    }
    
    const result = await mlService.classifyCancer(patientData);
    res.status(200).json(result);
  } catch (error) {
    log('Cancer classification API error:', error);
    res.status(500).json({ message: 'Failed to process cancer classification' });
  }
};

// @desc    Predict survival rates
// @route   POST /api/v1/ml/predict-survival
// @access  Private
export const predictSurvival = async (req: Request, res: Response) => {
  try {
    const patientData = req.body;
    
    if (!patientData) {
      return res.status(400).json({ message: 'Patient data is required' });
    }
    
    const result = await mlService.predictSurvival(patientData);
    res.status(200).json(result);
  } catch (error) {
    log('Survival prediction API error:', error);
    res.status(500).json({ message: 'Failed to process survival prediction' });
  }
};

// @desc    Optimize treatment plan
// @route   POST /api/v1/ml/optimize-treatment
// @access  Private
export const optimizeTreatment = async (req: Request, res: Response) => {
  try {
    const patientData = req.body;
    
    if (!patientData) {
      return res.status(400).json({ message: 'Patient data is required' });
    }
    
    const result = await mlService.optimizeTreatment(patientData);
    res.status(200).json(result);
  } catch (error) {
    log('Treatment optimization API error:', error);
    res.status(500).json({ message: 'Failed to process treatment optimization' });
  }
};
