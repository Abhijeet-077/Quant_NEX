import { Request, Response } from 'express';
import { quantumService } from '../services/quantumService';
import { log } from '../vite';

// @desc    Optimize radiation therapy using quantum computing
// @route   POST /api/v1/quantum/optimize-radiation
// @access  Private
export const optimizeRadiationTherapy = async (req: Request, res: Response) => {
  try {
    const patientData = req.body;
    
    if (!patientData) {
      return res.status(400).json({ message: 'Patient data is required' });
    }
    
    const result = await quantumService.optimizeRadiationTherapy(patientData);
    res.status(200).json(result);
  } catch (error) {
    log('Quantum radiation optimization API error:', error);
    res.status(500).json({ message: 'Failed to optimize radiation therapy' });
  }
};

// @desc    Analyze genomic data using quantum computing
// @route   POST /api/v1/quantum/analyze-genomic
// @access  Private
export const analyzeGenomicData = async (req: Request, res: Response) => {
  try {
    const { genomicData } = req.body;
    
    if (!genomicData) {
      return res.status(400).json({ message: 'Genomic data is required' });
    }
    
    const result = await quantumService.analyzeGenomicData(genomicData);
    res.status(200).json(result);
  } catch (error) {
    log('Quantum genomic analysis API error:', error);
    res.status(500).json({ message: 'Failed to analyze genomic data' });
  }
};

// @desc    Predict drug interactions using quantum computing
// @route   POST /api/v1/quantum/predict-drug-interactions
// @access  Private
export const predictDrugInteractions = async (req: Request, res: Response) => {
  try {
    const { medications } = req.body;
    
    if (!medications || !Array.isArray(medications) || medications.length < 2) {
      return res.status(400).json({ message: 'At least two medications are required' });
    }
    
    const result = await quantumService.predictDrugInteractions(medications);
    res.status(200).json(result);
  } catch (error) {
    log('Quantum drug interaction prediction API error:', error);
    res.status(500).json({ message: 'Failed to predict drug interactions' });
  }
};
