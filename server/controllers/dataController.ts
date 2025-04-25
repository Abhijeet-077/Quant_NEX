import { Request, Response } from 'express';
import { dataProcessingService } from '../services/dataProcessingService';
import { log } from '../vite';

// @desc    Get available datasets
// @route   GET /api/v1/data/datasets
// @access  Private
export const getAvailableDatasets = async (req: Request, res: Response) => {
  try {
    const datasets = dataProcessingService.getAvailableDatasets();
    
    // Get detailed info for each dataset
    const datasetsWithInfo = datasets.map(dataset => {
      return dataProcessingService.getDatasetInfo(dataset);
    }).filter(Boolean);
    
    res.status(200).json(datasetsWithInfo);
  } catch (error) {
    log('Get datasets error:', error);
    res.status(500).json({ message: 'Failed to retrieve datasets' });
  }
};

// @desc    Get dataset info
// @route   GET /api/v1/data/datasets/:name
// @access  Private
export const getDatasetInfo = async (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    
    const datasetInfo = dataProcessingService.getDatasetInfo(name);
    
    if (!datasetInfo) {
      return res.status(404).json({ message: 'Dataset not found' });
    }
    
    res.status(200).json(datasetInfo);
  } catch (error) {
    log('Get dataset info error:', error);
    res.status(500).json({ message: 'Failed to retrieve dataset info' });
  }
};

// @desc    Process tumor detection dataset
// @route   POST /api/v1/data/process/tumor-detection/:name
// @access  Private
export const processTumorDetectionDataset = async (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    
    const result = dataProcessingService.processTumorDetectionDataset(name);
    
    if (result.error) {
      return res.status(400).json({ message: result.error });
    }
    
    res.status(200).json(result);
  } catch (error) {
    log('Process tumor detection dataset error:', error);
    res.status(500).json({ message: 'Failed to process tumor detection dataset' });
  }
};

// @desc    Process cancer classification dataset
// @route   POST /api/v1/data/process/cancer-classification/:name
// @access  Private
export const processCancerClassificationDataset = async (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    
    const result = dataProcessingService.processCancerClassificationDataset(name);
    
    if (result.error) {
      return res.status(400).json({ message: result.error });
    }
    
    res.status(200).json(result);
  } catch (error) {
    log('Process cancer classification dataset error:', error);
    res.status(500).json({ message: 'Failed to process cancer classification dataset' });
  }
};
